import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

// Mirrors generateRef in /api/orders — kept local to avoid touching that route.
function generateRef() {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KOK-${date}-${rand}`;
}

interface CartItem {
  menuItem: { id: string; name: string; price: number };
  quantity: number;
}

export async function POST(request: Request) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { success: false, message: "Card payments are not available yet." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      items = [],
      customer = {},
      deliveryType = "delivery",
      deliveryFee = 0,
    } = body;

    if (!customer.name || !customer.email || !customer.phone) {
      return NextResponse.json(
        { success: false, message: "Name, email, and phone are required" },
        { status: 400 }
      );
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    const orderItems = (items as CartItem[]).map((item) => ({
      id: item.menuItem.id,
      name: item.menuItem.name,
      price: item.menuItem.price,
      quantity: item.quantity,
    }));

    const subtotal = orderItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const fee = deliveryType === "delivery" ? Number(deliveryFee) || 0 : 0;
    const orderTotal = subtotal + fee;
    const ref = generateRef();

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://kok-kitchens.vercel.app";

    // Build Stripe line items from authoritative cart prices (in pence).
    const lineItems: Array<{
      price_data: {
        currency: string;
        product_data: { name: string };
        unit_amount: number;
      };
      quantity: number;
    }> = orderItems.map((i) => ({
      price_data: {
        currency: "gbp",
        product_data: { name: i.name },
        unit_amount: Math.round(i.price * 100),
      },
      quantity: i.quantity,
    }));

    if (fee > 0) {
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: {
            name: deliveryType === "delivery" ? "Delivery" : "Service",
          },
          unit_amount: Math.round(fee * 100),
        },
        quantity: 1,
      });
    }

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customer.email,
      success_url: `${origin}/checkout/success?ref=${ref}`,
      cancel_url: `${origin}/checkout?canceled=1`,
      metadata: { orderRef: ref },
    });

    // Record the order as unpaid; the webhook flips it to paid on completion.
    const sql = getDb();
    await sql`
      INSERT INTO orders (
        ref, customer_name, customer_email, customer_phone,
        delivery_type, delivery_address, delivery_city,
        items, subtotal, delivery_fee, total, notes,
        payment_method, payment_status, stripe_session_id
      ) VALUES (
        ${ref}, ${customer.name}, ${customer.email}, ${customer.phone},
        ${deliveryType}, ${customer.address || null}, ${customer.city || null},
        ${JSON.stringify(orderItems)}, ${subtotal}, ${fee}, ${orderTotal},
        ${customer.notes || null},
        'card', 'unpaid', ${session.id}
      )
    `;

    return NextResponse.json({ success: true, url: session.url, ref });
  } catch (error) {
    console.error("Checkout session failed:", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: `Checkout failed: ${detail}` },
      { status: 500 }
    );
  }
}
