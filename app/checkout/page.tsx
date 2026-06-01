"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Package } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/menu-data";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">(
    "delivery"
  );
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });

  const deliveryFee = deliveryType === "delivery" ? 4.99 : 0;
  const grandTotal = totalPrice + deliveryFee;

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
          items: items.map((i) => ({
            id: i.menuItem.id,
            name: i.menuItem.name,
            price: i.menuItem.price,
            quantity: i.quantity,
          })),
          customer: form,
          deliveryType,
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
              <div className="rounded-2xl bg-white border border-stone-200 p-6">
                <h2 className="text-lg font-semibold text-stone-900 mb-4">
                  Delivery Method
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("delivery")}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                      deliveryType === "delivery"
                        ? "border-orange-500 bg-orange-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <MapPin
                      className={`h-5 w-5 ${
                        deliveryType === "delivery"
                          ? "text-orange-600"
                          : "text-stone-400"
                      }`}
                    />
                    <div className="text-left">
                      <p className="font-medium text-stone-900 text-sm">
                        Delivery
                      </p>
                      <p className="text-xs text-stone-500">
                        {formatPrice(4.99)}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("pickup")}
                    className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                      deliveryType === "pickup"
                        ? "border-orange-500 bg-orange-50"
                        : "border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <Package
                      className={`h-5 w-5 ${
                        deliveryType === "pickup"
                          ? "text-orange-600"
                          : "text-stone-400"
                      }`}
                    />
                    <div className="text-left">
                      <p className="font-medium text-stone-900 text-sm">
                        Pickup
                      </p>
                      <p className="text-xs text-stone-500">Free</p>
                    </div>
                  </button>
                </div>
              </div>

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

                  {deliveryType === "delivery" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          Delivery Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.address}
                          onChange={(e) =>
                            updateField("address", e.target.value)
                          }
                          className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.city}
                          onChange={(e) =>
                            updateField("city", e.target.value)
                          }
                          placeholder="e.g. Radlett, Borehamwood, Watford"
                          className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
                        />
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
                    <span className="text-stone-500">Delivery</span>
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

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full rounded-full bg-orange-600 py-3.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
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
                    href={`https://wa.me/44744782712?text=${encodeURIComponent(
                      `Hi KOK Kitchen! I'd like to order:\n\n${items
                        .map(
                          (i) =>
                            `${i.quantity}x ${i.menuItem.name} (${formatPrice(i.menuItem.price * i.quantity)})`
                        )
                        .join("\n")}\n\nSubtotal: ${formatPrice(totalPrice)}${deliveryFee > 0 ? `\nDelivery: ${formatPrice(deliveryFee)}` : ""}\nTotal: ${formatPrice(grandTotal)}\n\nDelivery type: ${deliveryType}`
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
