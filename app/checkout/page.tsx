"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Package, Truck, Info } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/menu-data";

// Local postcodes — self-delivery at £4.99
const LOCAL_POSTCODES = [
  "WD6", "WD7", "WD23", "WD25", // Borehamwood, Radlett, Bushey, Watford
  "EN5", "EN6",                   // Barnet, Potters Bar
];

// Extended postcodes — courier at £7.99
const EXTENDED_POSTCODES = [
  "WD1", "WD2", "WD3", "WD4", "WD5", "WD17", "WD18", "WD19", "WD24",
  "HA0", "HA1", "HA2", "HA3", "HA4", "HA5", "HA6", "HA7", "HA8", "HA9",
  "NW4", "NW7", "NW9", "NW11",
  "N2", "N3", "N11", "N12", "N14", "N20",
  "EN1", "EN2", "EN3", "EN4", "EN7", "EN8",
  "AL1", "AL2", "AL3", "AL4", "AL10",
  "HP1", "HP2", "HP3",
];

type DeliveryType = "delivery-local" | "delivery-extended" | "pickup";

function getDeliveryZone(postcode: string): "local" | "extended" | "unknown" {
  const prefix = postcode.toUpperCase().replace(/\s/g, "").match(/^[A-Z]+\d+/)?.[0] || "";
  if (LOCAL_POSTCODES.includes(prefix)) return "local";
  if (EXTENDED_POSTCODES.includes(prefix)) return "extended";
  return "unknown";
}

function getDeliveryFee(type: DeliveryType): number {
  if (type === "delivery-local") return 4.99;
  if (type === "delivery-extended") return 7.99;
  return 0;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery-local");
  const [submitting, setSubmitting] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [postcodeChecked, setPostcodeChecked] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const deliveryFee = getDeliveryFee(deliveryType);
  const grandTotal = totalPrice + deliveryFee;
  const isDelivery = deliveryType !== "pickup";

  function handlePostcodeCheck(value: string) {
    setPostcode(value);
    if (value.length >= 3) {
      const zone = getDeliveryZone(value);
      if (zone === "local") {
        setDeliveryType("delivery-local");
        setPostcodeChecked(true);
      } else if (zone === "extended") {
        setDeliveryType("delivery-extended");
        setPostcodeChecked(true);
      } else {
        setPostcodeChecked(true);
      }
    } else {
      setPostcodeChecked(false);
    }
  }

  const postcodeZone = postcode.length >= 3 ? getDeliveryZone(postcode) : null;

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: { ...form, postcode },
          deliveryType: isDelivery ? "delivery" : "pickup",
          subtotal: totalPrice,
          deliveryFee,
          total: grandTotal,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      clearCart();
      router.push("/checkout/success");
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-stone-500 mb-6">
            Add some delicious meals before checking out
          </p>
          <Link
            href="/menu"
            className="inline-flex rounded-full bg-orange-600 px-6 py-3 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-orange-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-stone-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              {/* Delivery Method */}
              <div className="rounded-2xl bg-white border border-stone-200 p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Delivery Method
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => { setDeliveryType("delivery-local"); setPostcodeChecked(false); }}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                      deliveryType === "delivery-local"
                        ? "border-orange-500 bg-orange-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <MapPin className={`h-5 w-5 ${deliveryType === "delivery-local" ? "text-orange-600" : "text-stone-400"}`} />
                    <div className="text-center">
                      <p className="font-medium text-stone-900 text-sm">Local</p>
                      <p className="text-xs text-stone-500">{formatPrice(4.99)}</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDeliveryType("delivery-extended"); setPostcodeChecked(false); }}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                      deliveryType === "delivery-extended"
                        ? "border-orange-500 bg-orange-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <Truck className={`h-5 w-5 ${deliveryType === "delivery-extended" ? "text-orange-600" : "text-stone-400"}`} />
                    <div className="text-center">
                      <p className="font-medium text-stone-900 text-sm">Extended</p>
                      <p className="text-xs text-stone-500">{formatPrice(7.99)}</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("pickup")}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-colors ${
                      deliveryType === "pickup"
                        ? "border-orange-500 bg-orange-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <Package className={`h-5 w-5 ${deliveryType === "pickup" ? "text-orange-600" : "text-stone-400"}`} />
                    <div className="text-center">
                      <p className="font-medium text-stone-900 text-sm">Pickup</p>
                      <p className="text-xs text-stone-500">Free</p>
                    </div>
                  </button>
                </div>

                {/* Pickup address */}
                {deliveryType === "pickup" && (
                  <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-200 flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-stone-700">
                      <p className="font-medium text-stone-900">Pickup address</p>
                      <p>10 Kendals Close, Radlett</p>
                    </div>
                  </div>
                )}

                {/* Postcode checker for delivery */}
                {isDelivery && (
                  <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Check your postcode
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={postcode}
                        onChange={(e) => handlePostcodeCheck(e.target.value)}
                        placeholder="e.g. WD7 8PQ"
                        className="flex-1 rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 uppercase focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                        maxLength={8}
                      />
                    </div>
                    {postcodeChecked && postcodeZone === "local" && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs">✓</span>
                        Local delivery — {formatPrice(4.99)}
                      </div>
                    )}
                    {postcodeChecked && postcodeZone === "extended" && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-orange-600">
                        <Truck className="h-4 w-4" />
                        Extended delivery — {formatPrice(7.99)}
                      </div>
                    )}
                    {postcodeChecked && postcodeZone === "unknown" && (
                      <div className="mt-2 flex items-start gap-2 text-sm text-stone-500">
                        <Info className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>
                          We may not deliver to this area yet.
                          <a href="https://wa.me/447447982712?text=Hi!%20Do%20you%20deliver%20to%20my%20area%3F%20My%20postcode%20is%20" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium ml-1">
                            WhatsApp us to check →
                          </a>
                        </span>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-stone-400">
                      <strong>Local:</strong> Borehamwood, Radlett, Bushey, Barnet, Potters Bar
                      <br />
                      <strong>Extended:</strong> Watford, Harrow, North London, St Albans, Hemel
                    </p>
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="rounded-2xl bg-white border border-stone-200 p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Your Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+44..."
                        className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  {isDelivery && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Delivery Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.address}
                          onChange={(e) => updateField("address", e.target.value)}
                          className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={form.city}
                            onChange={(e) => updateField("city", e.target.value)}
                            placeholder="e.g. Radlett, Borehamwood"
                            className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-stone-700 mb-1">
                            Postcode *
                          </label>
                          <input
                            type="text"
                            required
                            value={postcode}
                            onChange={(e) => handlePostcodeCheck(e.target.value)}
                            placeholder="e.g. WD7 8PQ"
                            className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 uppercase focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Order Notes
                    </label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Any special requests? (e.g. extra spicy, no onions)"
                      className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white border border-stone-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.menuItem.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-stone-600">
                        {item.menuItem.name} x{item.quantity}
                      </span>
                      <span className="font-medium text-stone-900">
                        {formatPrice(item.menuItem.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-100 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="text-stone-700">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">
                      Delivery
                      {deliveryType === "delivery-local" && (
                        <span className="text-xs text-stone-400 ml-1">(local)</span>
                      )}
                      {deliveryType === "delivery-extended" && (
                        <span className="text-xs text-stone-400 ml-1">(extended)</span>
                      )}
                    </span>
                    <span className="text-stone-700">
                      {deliveryFee === 0
                        ? "Free"
                        : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold border-t border-stone-100 pt-3">
                    <span className="text-stone-900">Total</span>
                    <span className="text-orange-600">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {totalPrice < 20 && (
                  <p className="mt-6 text-sm text-red-600 text-center font-medium">
                    Minimum order amount is {formatPrice(20)}. Please add {formatPrice(20 - totalPrice)} more to proceed.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || totalPrice < 20}
                  className="mt-4 w-full rounded-full bg-orange-600 py-3.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>

                <p className="mt-3 text-xs text-stone-400 text-center">
                  Payment on delivery. You&apos;ll receive an order
                  confirmation via email.
                </p>

                {/* WhatsApp checkout alternative */}
                <div className="mt-4 pt-4 border-t border-stone-100 text-center">
                  <p className="text-xs text-stone-400 mb-2">
                    Prefer to order via chat?
                  </p>
                  <a
                    href={`https://wa.me/447447982712?text=${encodeURIComponent(
                      `Hi KOK Kitchens! I'd like to order:\n\n${items
                        .map(
                          (i) =>
                            `${i.quantity}x ${i.menuItem.name} (${formatPrice(i.menuItem.price * i.quantity)})`
                        )
                        .join("\n")}\n\nSubtotal: ${formatPrice(totalPrice)}${deliveryFee > 0 ? `\nDelivery: ${formatPrice(deliveryFee)}` : ""}\nTotal: ${formatPrice(grandTotal)}\n\nDelivery type: ${deliveryType === "pickup" ? "Pickup" : "Delivery"}${postcode ? `\nPostcode: ${postcode}` : ""}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-green-600 px-5 py-2.5 text-sm font-medium text-green-600 hover:bg-green-600 hover:text-white transition-all"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Order via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
