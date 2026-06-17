import { NextResponse } from "next/server";
import { getDeliveryQuote, isUberConfigured } from "@/lib/uber-delivery";

export async function POST(request: Request) {
  try {
    const { address, city, postcode } = await request.json();

    if (!address || !postcode) {
      return NextResponse.json(
        { success: false, message: "Address and postcode are required" },
        { status: 400 }
      );
    }

    if (!isUberConfigured()) {
      return NextResponse.json({
        success: true,
        quote: null,
        fallbackFee: 7.99,
        message: "Uber not configured — using flat-rate delivery fee",
      });
    }

    const quote = await getDeliveryQuote({ address, city, postcode });

    return NextResponse.json({
      success: true,
      quote: {
        id: quote.id,
        fee: quote.fee,
        currency: quote.currency,
        estimatedMinutes: quote.estimatedDeliveryMinutes,
        expiresAt: quote.expiresAt,
      },
    });
  } catch (error) {
    console.error("Delivery quote failed:", error);
    return NextResponse.json({
      success: true,
      quote: null,
      fallbackFee: 7.99,
      message: "Could not get live quote — using flat-rate delivery fee",
    });
  }
}
