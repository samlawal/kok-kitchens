import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendOwnerNotification, sendCustomerConfirmation } from "@/lib/email";

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

    // Fire emails in background — don't block the response
    Promise.all([
      sendOwnerNotification(emailData),
      sendCustomerConfirmation(emailData),
    ]).catch((err) => console.error("Email send failed:", err));

    return NextResponse.json(
      { success: true, ref, message: "Order placed successfully" },
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
