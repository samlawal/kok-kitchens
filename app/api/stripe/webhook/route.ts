import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import { sendOwnerNotification, sendCustomerConfirmation } from "@/lib/email";
import { sendPushNotification } from "@/lib/notify";

// Stripe needs the raw request body to verify the signature.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ received: false }, { status: 500 });
  }

  const sig = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, sig || "", secret);
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("Stripe signature verification failed:", detail);
    return NextResponse.json({ received: false }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const ref = session.metadata?.orderRef;

    if (ref) {
      try {
        const sql = getDb();
        // Flip to paid only if not already paid — idempotent against retries,
        // so the confirmation emails are sent exactly once.
        const rows = await sql`
          UPDATE orders
          SET payment_status = 'paid'
          WHERE ref = ${ref} AND payment_status != 'paid'
          RETURNING ref, customer_name, customer_email, customer_phone,
                    delivery_type, delivery_address, delivery_city,
                    items, subtotal, delivery_fee, total, notes
        `;

        if (rows.length > 0) {
          const o = rows[0];
          const items = (o.items as { name: string; price: number; quantity: number }[]) || [];
          const emailData = {
            ref: o.ref as string,
            customerName: o.customer_name as string,
            customerEmail: o.customer_email as string,
            customerPhone: o.customer_phone as string,
            deliveryType: o.delivery_type as "delivery" | "pickup",
            deliveryAddress: (o.delivery_address as string) || undefined,
            deliveryCity: (o.delivery_city as string) || undefined,
            items,
            subtotal: Number(o.subtotal),
            deliveryFee: Number(o.delivery_fee),
            total: Number(o.total),
            notes: (o.notes as string) || undefined,
          };

          await Promise.all([
            sendOwnerNotification(emailData),
            sendCustomerConfirmation(emailData),
            sendPushNotification({
              ref: emailData.ref,
              customerName: emailData.customerName,
              customerPhone: emailData.customerPhone,
              deliveryType: emailData.deliveryType,
              paymentMethod: "card",
              items,
              total: emailData.total,
            }),
          ]).catch((e) => console.error("Paid-order notifications failed:", e));
        }
      } catch (error) {
        console.error("Failed to finalize paid order:", error);
        // Return 200 anyway so Stripe doesn't hammer retries on a DB blip;
        // the payment succeeded regardless and is visible in the dashboard.
      }
    }
  }

  return NextResponse.json({ received: true });
}
