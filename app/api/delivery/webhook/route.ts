import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { id, status, tracking_url, external_id } = body;

    if (!id || !status) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    console.log(
      `[Uber Webhook] Delivery ${id} (order ${external_id}): ${status}`
    );

    const sql = getDb();
    await sql`
      UPDATE orders
      SET delivery_status = ${status},
          delivery_tracking_url = ${tracking_url || null},
          delivery_id = ${id},
          updated_at = NOW()
      WHERE ref = ${external_id}
    `.catch((err: unknown) => {
      console.error("Failed to update order delivery status:", err);
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ ok: true });
  }
}
