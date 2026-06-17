import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendOwnerNotification, sendCustomerConfirmation } from "@/lib/email";
import { sendPushNotification } from "@/lib/notify";
import { createDelivery, isUberConfigured } from "@/lib/uber-delivery";

function generateRef() {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KOK-${date}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      items = [],
      customer = {},
      deliveryType = "delivery",
      deliveryZone = "local",
      deliveryQuoteId,
      total = 0,
    } = body;

    // Validate required fields
    if (!customer.name || !customer.email || !customer.phone) {
      return NextResponse.json(
        { success: false, message: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    const ref = generateRef();
    const deliveryFee = deliveryType === "delivery" ? 4.99 : 0;
    const subtotal = items.reduce(
      (sum: number, item: { menuItem: { price: number }; quantity: number }) =>
        sum + item.menuItem.price * item.quantity,
      0
    );
    const orderTotal = total || subtotal + deliveryFee;

    // Prepare items for storage
    const orderItems = items.map(
      (item: { menuItem: { id: string; name: string; price: number }; quantity: number }) => ({
        id: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
      })
    );

    // Save to Neon database
    const sql = getDb();
    await sql`
      INSERT INTO orders (ref, customer_name, customer_email, customer_phone, delivery_type, delivery_address, delivery_city, items, subtotal, delivery_fee, total, notes)
      VALUES (
        ${ref},
        ${customer.name},
        ${customer.email},
        ${customer.phone},
        ${deliveryType},
        ${customer.address || null},
        ${customer.city || null},
        ${JSON.stringify(orderItems)},
        ${subtotal},
        ${deliveryFee},
        ${orderTotal},
        ${customer.notes || null}
      )
    `;

    // Send email notifications (don't block response on these)
    const emailData = {
      ref,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      deliveryType,
      deliveryAddress: customer.address,
      deliveryCity: customer.city,
      items: orderItems,
      subtotal,
      deliveryFee,
      total: orderTotal,
      notes: customer.notes,
    };

    // Await notifications: in serverless the function can be frozen the instant
    // the response returns, so fire-and-forget sends get dropped before they
    // complete. allSettled so one failing channel doesn't block the others.
    await Promise.allSettled([
      sendOwnerNotification(emailData),
      sendCustomerConfirmation(emailData),
      sendPushNotification({
        ref,
        customerName: customer.name,
        customerPhone: customer.phone,
        deliveryType,
        items: orderItems,
        total: orderTotal,
      }),
    ]);

    // Dispatch Uber courier for extended-zone deliveries. Awaited so the
    // tracking link is available for the confirmation response. The order is
    // already saved, so a dispatch failure is logged but never fails the order.
    let trackingUrl: string | undefined;
    if (
      deliveryType === "delivery" &&
      deliveryZone === "extended" &&
      isUberConfigured()
    ) {
      try {
        const delivery = await createDelivery({
          quoteId: deliveryQuoteId,
          orderRef: ref,
          dropoffName: customer.name,
          dropoffPhone: customer.phone,
          dropoffAddress: customer.address || "",
          dropoffCity: customer.city || "",
          dropoffPostcode: customer.postcode || "",
          dropoffNotes: customer.notes,
          items: orderItems.map(
            (i: { name: string; quantity: number }) => ({
              name: i.name,
              quantity: i.quantity,
            })
          ),
        });
        trackingUrl = delivery.trackingUrl;
        console.log(
          `[Uber] Dispatched delivery ${delivery.deliveryId} for order ${ref}`
        );
        await sql`
          UPDATE orders
          SET delivery_id = ${delivery.deliveryId},
              delivery_tracking_url = ${delivery.trackingUrl},
              delivery_status = ${delivery.status}
          WHERE ref = ${ref}
        `;
      } catch (err) {
        console.error(`[Uber] Failed to dispatch for ${ref}:`, err);
      }
    }

    return NextResponse.json(
      { success: true, ref, trackingUrl, message: "Order placed successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
