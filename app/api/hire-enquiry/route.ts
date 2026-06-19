import { NextResponse } from "next/server";
import { Resend } from "resend";
import { dispatchNotifications } from "@/lib/order-notifications";
import { hireItems } from "@/lib/hire-data";

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "orders@kokkitchens.com";
const NTFY_TOPIC = process.env.NTFY_TOPIC || "kok-kitchen-orders";

interface EnquiryItem {
  id: string;
  quantity: number;
}

function gbp(n: number) {
  return `£${n.toFixed(2)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, eventDate, notes, items = [] } = body;

    if (!name || !phone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Name, phone and at least one item are required" },
        { status: 400 }
      );
    }

    // Resolve item ids server-side — authoritative names + prices, never trust
    // the client's numbers.
    const byId = new Map(hireItems.map((i) => [i.id, i]));
    const lines = (items as EnquiryItem[])
      .map(({ id, quantity }) => {
        const it = byId.get(id);
        const qty = Number(quantity);
        if (!it || !Number.isFinite(qty) || qty <= 0) return null;
        return { name: it.name, qty, price: it.price, line: it.price * qty };
      })
      .filter((l): l is { name: string; qty: number; price: number; line: number } => l !== null);

    if (lines.length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid hire items selected" },
        { status: 400 }
      );
    }

    const total = lines.reduce((s, l) => s + l.line, 0);
    const ref = `HIRE-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const itemsText = lines.map((l) => `${l.qty}× ${l.name} — ${gbp(l.line)}`).join("\n");
    const itemsHtml = lines
      .map(
        (l) =>
          `<tr><td style="padding:6px 0;border-bottom:1px solid #e7e5e4;">${l.qty}× ${l.name}</td><td style="padding:6px 0;border-bottom:1px solid #e7e5e4;text-align:right;">${gbp(l.line)}</td></tr>`
      )
      .join("");

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = "KOK Kitchens Hire <orders@kokkitchens.com>";

    const ownerHtml = `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#1c1917;">
        <div style="background:#ea580c;padding:20px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">New Hire Enquiry</h1>
          <p style="color:#fed7aa;margin:4px 0 0;font-size:14px;">${ref}</p>
        </div>
        <div style="background:#fafaf9;padding:20px;border:1px solid #e7e5e4;border-top:none;border-radius:0 0 12px 12px;">
          <p style="margin:4px 0;font-size:14px;"><strong>${name}</strong></p>
          <p style="margin:4px 0;font-size:14px;">📞 <a href="tel:${phone}">${phone}</a></p>
          ${email ? `<p style="margin:4px 0;font-size:14px;">📧 <a href="mailto:${email}">${email}</a></p>` : ""}
          ${eventDate ? `<p style="margin:4px 0;font-size:14px;">📅 Event date: <strong>${eventDate}</strong></p>` : ""}
          <h2 style="font-size:16px;margin:16px 0 8px;">Items</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px;"><tbody>${itemsHtml}</tbody></table>
          <p style="margin:12px 0 0;font-size:16px;display:flex;justify-content:space-between;border-top:2px solid #e7e5e4;padding-top:10px;">
            <strong>Estimated total</strong> <strong style="color:#ea580c;">${gbp(total)}</strong>
          </p>
          ${notes ? `<div style="margin-top:14px;padding:12px;background:#fef3c7;border-radius:8px;font-size:13px;"><strong>Notes:</strong> ${notes}</div>` : ""}
          <p style="margin-top:14px;font-size:12px;color:#78716c;">Confirm availability, deposit and delivery/collection with the customer.</p>
        </div>
      </div>`;

    const channels: Array<() => Promise<unknown>> = [
      () =>
        resend.emails.send({
          from,
          to: NOTIFICATION_EMAIL,
          subject: `🍽️ Hire enquiry ${ref} — ${name} (${gbp(total)})`,
          html: ownerHtml,
        }),
      () =>
        fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
          method: "POST",
          headers: {
            Title: `New hire enquiry — ${name}`,
            Priority: "high",
            Tags: "package,moneybag",
            Actions: `view, Call, tel:${phone}`,
          },
          body: `${itemsText}\n\nEstimated: ${gbp(total)}${eventDate ? `\nEvent: ${eventDate}` : ""}\nPhone: ${phone}`,
        }),
    ];

    if (email) {
      channels.push(() =>
        resend.emails.send({
          from,
          to: email,
          subject: `We've got your hire enquiry — KOK Kitchens (${ref})`,
          html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#1c1917;">
            <div style="background:#ea580c;padding:20px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:white;margin:0;font-size:20px;">Thanks, ${name}!</h1>
            </div>
            <div style="background:#fafaf9;padding:20px;border:1px solid #e7e5e4;border-top:none;border-radius:0 0 12px 12px;font-size:14px;">
              <p>We've received your hire enquiry (<strong>${ref}</strong>) and we'll be in touch shortly to confirm availability, deposit and delivery.</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:8px;"><tbody>${itemsHtml}</tbody></table>
              <p style="margin-top:10px;"><strong>Estimated total: ${gbp(total)}</strong></p>
              <p style="margin-top:14px;color:#78716c;">Questions? WhatsApp us at <a href="https://wa.me/447447982712" style="color:#ea580c;">+44 7447 982712</a></p>
            </div>
          </div>`,
        })
      );
    }

    await dispatchNotifications(channels);

    return NextResponse.json({ success: true, ref });
  } catch (error) {
    console.error("Hire enquiry failed:", error);
    return NextResponse.json(
      { success: false, message: "Could not send your enquiry. Please try again or WhatsApp us." },
      { status: 500 }
    );
  }
}
