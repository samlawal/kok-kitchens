import { NextResponse } from "next/server";
import { Resend } from "resend";
import { dispatchNotifications } from "@/lib/order-notifications";
import { londonTime } from "@/lib/notify";
import { validateCateringEnquiry } from "@/lib/catering-validation";
import { getDb } from "@/lib/db";

const NOTIFICATION_EMAIL =
  process.env.NOTIFICATION_EMAIL || "orders@kokkitchens.com";
// Catering quotes are planning leads, not same-day orders — default them to the
// main order topic the owner already watches (override with NTFY_CATERING_TOPIC).
const NTFY_CATERING_TOPIC =
  process.env.NTFY_CATERING_TOPIC ||
  process.env.NTFY_TOPIC ||
  "kok-kitchen-orders";

const EVENT_LABELS: Record<string, string> = {
  wedding: "Wedding",
  birthday: "Birthday Party",
  corporate: "Corporate Event",
  funeral: "Funeral / Memorial",
  naming: "Naming Ceremony",
  other: "Other",
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // Validate shape + event date server-side (pure, unit-tested). Never trust
    // the client to have validated anything.
    const valid = validateCateringEnquiry(body);
    if (!valid.ok) {
      return NextResponse.json(
        { success: false, message: valid.message },
        { status: valid.status }
      );
    }
    const { name, phone, email, eventIso, guestCount, eventType, details } =
      valid;
    const ref = `CATER-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const eventLabel = EVENT_LABELS[eventType] ?? "Other";

    // Best-effort persistence for records + future BI — never block the lead
    // notification on a DB hiccup (tables may also not be initialised yet).
    try {
      const sql = getDb();
      await sql`
        INSERT INTO catering_enquiries
          (ref, customer_name, customer_phone, customer_email, event_date, guest_count, event_type, details)
        VALUES (${ref}, ${name}, ${phone}, ${email}, ${eventIso}, ${guestCount}, ${eventType}, ${details || null})
      `;
    } catch (error) {
      console.error("Catering enquiry persistence skipped:", error);
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = "KOK Kitchens Catering <orders@kokkitchens.com>";

    const ownerHtml = `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#1c1917;">
        <div style="background:#ea580c;padding:20px;border-radius:12px 12px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">New Catering Enquiry</h1>
          <p style="color:#fed7aa;margin:4px 0 0;font-size:14px;">${ref}</p>
        </div>
        <div style="background:#fafaf9;padding:20px;border:1px solid #e7e5e4;border-top:none;border-radius:0 0 12px 12px;">
          <p style="margin:4px 0;font-size:14px;"><strong>${name}</strong></p>
          <p style="margin:4px 0;font-size:14px;">📞 <a href="tel:${phone}">${phone}</a></p>
          <p style="margin:4px 0;font-size:14px;">📧 <a href="mailto:${email}">${email}</a></p>
          <p style="margin:4px 0;font-size:14px;">📅 Event date: <strong>${eventIso}</strong></p>
          <p style="margin:4px 0;font-size:14px;">🎉 ${eventLabel} · <strong>${guestCount}</strong> guests</p>
          ${details ? `<div style="margin-top:14px;padding:12px;background:#fef3c7;border-radius:8px;font-size:13px;"><strong>Details:</strong> ${details}</div>` : ""}
          <p style="margin-top:14px;font-size:12px;color:#78716c;">Reply within 24 hours with a tailored quote.</p>
        </div>
      </div>`;

    const customerHtml = `
      <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#1c1917;">
        <div style="background:#ea580c;padding:20px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:white;margin:0;font-size:20px;">Thanks, ${name}!</h1>
        </div>
        <div style="background:#fafaf9;padding:20px;border:1px solid #e7e5e4;border-top:none;border-radius:0 0 12px 12px;font-size:14px;">
          <p>We've received your catering request (<strong>${ref}</strong>) for <strong>${guestCount}</strong> guests on <strong>${eventIso}</strong>, and our team will get back to you within 24 hours with a tailored quote.</p>
          <p style="margin-top:14px;color:#78716c;">Questions? WhatsApp us at <a href="https://wa.me/447447982712" style="color:#ea580c;">+44 7447 982712</a></p>
        </div>
      </div>`;

    const channels: Array<() => Promise<unknown>> = [
      () =>
        resend.emails.send({
          from,
          to: NOTIFICATION_EMAIL,
          subject: `🎉 Catering enquiry ${ref} — ${name} (${guestCount} guests, ${eventIso})`,
          html: ownerHtml,
        }),
      () =>
        fetch(`https://ntfy.sh/${NTFY_CATERING_TOPIC}`, {
          method: "POST",
          headers: {
            Title: `New catering enquiry — ${name}`,
            Priority: "high",
            Tags: "tada,plate_with_cutlery",
            Actions: `view, Call, tel:${phone}`,
          },
          body: `Placed ${londonTime()}\n${eventLabel} · ${guestCount} guests · ${eventIso}\nPhone: ${phone}${details ? `\nNotes: ${details}` : ""}`,
        }),
      () =>
        resend.emails.send({
          from,
          to: email,
          subject: `We've got your catering request — KOK Kitchens (${ref})`,
          html: customerHtml,
        }),
    ];

    // Must be awaited — in serverless, un-awaited sends are dropped on response.
    await dispatchNotifications(channels);

    return NextResponse.json({ success: true, ref });
  } catch (error) {
    console.error("Catering enquiry failed:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Could not send your request. Please try again or WhatsApp us.",
      },
      { status: 500 }
    );
  }
}
