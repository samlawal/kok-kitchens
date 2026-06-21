import { NextResponse } from "next/server";
import { Resend } from "resend";
import { dispatchNotifications } from "@/lib/order-notifications";
import { londonTime } from "@/lib/notify";
import { hireItems } from "@/lib/hire-data";
import { getDb } from "@/lib/db";
import { computeAvailability, type HireBooking } from "@/lib/hire-availability";
import { validateHireEnquiry } from "@/lib/hire-validation";

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "orders@kokkitchens.com";
// Hire has its own ntfy topic so equipment enquiries don't mix into the
// time-critical food-order stream (and can be muted/handled separately).
const NTFY_HIRE_TOPIC = process.env.NTFY_HIRE_TOPIC || "kok-kitchen-hire";
// How long a fresh enquiry holds its stock before the soft hold lapses.
const HOLD_HOURS = 48;

interface InvRow {
  item_id: string;
  total_qty: number;
}
interface BookingRow {
  status: string;
  hire_out_date: string | Date;
  return_date: string | Date;
  items: unknown;
  hold_expires_at: string | Date | null;
}

function toIsoDate(v: string | Date): string {
  if (v instanceof Date) {
    const y = v.getFullYear();
    const m = `${v.getMonth() + 1}`.padStart(2, "0");
    const d = `${v.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(v).slice(0, 10);
}

function gbp(n: number) {
  return `£${n.toFixed(2)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, eventDate, notes } = body;

    // Validate shape, resolve authoritative catalogue lines/prices, and check
    // the event date (real date, not in the past). Pure + unit-tested in
    // lib/hire-validation; never trust the client's numbers.
    const valid = validateHireEnquiry(body, hireItems);
    if (!valid.ok) {
      return NextResponse.json(
        { success: false, message: valid.message },
        { status: valid.status }
      );
    }
    const { lines, total, eventIso } = valid;
    const ref = `HIRE-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    // When a valid (future) event date is supplied, re-check availability
    // server-side and persist a soft-hold booking so two customers can't
    // oversell the same stock. Items without an inventory row are unmanaged
    // (no cap). If the DB or tables aren't ready, we skip persistence and still
    // send the enquiry. (eventIso is already validated by validateHireEnquiry.)
    if (eventIso) {
      try {
        const sql = getDb();
        const invRows = (await sql`
          SELECT item_id, total_qty FROM hire_inventory
        `) as unknown as InvRow[];
        const inventory: Record<string, number> = {};
        for (const r of invRows) inventory[r.item_id] = Number(r.total_qty);

        const bookingRows = (await sql`
          SELECT status,
                 hire_out_date::text AS hire_out_date,
                 return_date::text AS return_date,
                 items, hold_expires_at
          FROM hire_bookings
          WHERE status IN ('enquiry', 'confirmed', 'out', 'returned')
        `) as unknown as BookingRow[];
        const existing: HireBooking[] = bookingRows.map((r) => ({
          status: r.status,
          hire_out_date: toIsoDate(r.hire_out_date),
          return_date: toIsoDate(r.return_date),
          items: Array.isArray(r.items) ? (r.items as HireBooking["items"]) : [],
          hold_expires_at: r.hold_expires_at
            ? new Date(r.hold_expires_at).toISOString()
            : null,
        }));

        const avail = computeAvailability(inventory, existing, eventIso, eventIso);
        const shortfalls = lines
          .filter((l) => l.id in avail && l.qty > avail[l.id].available)
          .map((l) => `${l.name} (${avail[l.id].available} left for ${eventIso})`);

        if (shortfalls.length > 0) {
          return NextResponse.json(
            {
              success: false,
              message: `Some items aren't available for that date: ${shortfalls.join(
                ", "
              )}. Please adjust quantities or pick another date.`,
            },
            { status: 409 }
          );
        }

        const holdExpires = new Date(
          Date.now() + HOLD_HOURS * 60 * 60 * 1000
        ).toISOString();
        const bookingItems = lines.map((l) => ({ item_id: l.id, quantity: l.qty }));
        await sql`
          INSERT INTO hire_bookings
            (ref, customer_name, customer_phone, customer_email, hire_out_date, return_date, items, status, notes, hold_expires_at)
          VALUES (
            ${ref}, ${name}, ${phone}, ${email || null}, ${eventIso}, ${eventIso},
            ${JSON.stringify(bookingItems)}, 'enquiry', ${notes || null}, ${holdExpires}
          )
        `;
      } catch (error) {
        // Persistence is best-effort for the MVP — never block the enquiry
        // email on a DB hiccup. (Availability shortfalls above DO block.)
        console.error("Hire booking persistence skipped:", error);
      }
    }
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
        fetch(`https://ntfy.sh/${NTFY_HIRE_TOPIC}`, {
          method: "POST",
          headers: {
            Title: `New hire enquiry — ${name}`,
            Priority: "high",
            Tags: "package,moneybag",
            Actions: `view, Call, tel:${phone}`,
          },
          body: `Placed ${londonTime()}\n${itemsText}\n\nEstimated: ${gbp(total)}${eventDate ? `\nEvent: ${eventDate}` : ""}\nPhone: ${phone}`,
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
