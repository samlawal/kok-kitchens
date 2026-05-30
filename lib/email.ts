import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailData {
  ref: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryType: "delivery" | "pickup";
  deliveryAddress?: string;
  deliveryCity?: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
}

function formatCurrency(amount: number) {
  return `£${amount.toFixed(2)}`;
}

function buildItemsHtml(items: OrderEmailData["items"]) {
  return items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e7e5e4;">${item.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e7e5e4;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e7e5e4;text-align:right;">${formatCurrency(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");
}

// Email to the business owner
export async function sendOwnerNotification(order: OrderEmailData) {
  const notificationEmail = process.env.NOTIFICATION_EMAIL || "hello@kokkitchen.co.uk";

  try {
    await resend.emails.send({
      from: "KOK Kitchen Orders <orders@kokkitchen.co.uk>",
      to: notificationEmail,
      subject: `🍛 New Order #${order.ref} — ${formatCurrency(order.total)} (${order.deliveryType})`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#1c1917;">
          <div style="background:#ea580c;padding:24px;border-radius:12px 12px 0 0;">
            <h1 style="color:white;margin:0;font-size:20px;">New Order Received!</h1>
            <p style="color:#fed7aa;margin:4px 0 0;font-size:14px;">Order #${order.ref}</p>
          </div>

          <div style="background:#fafaf9;padding:24px;border:1px solid #e7e5e4;border-top:none;border-radius:0 0 12px 12px;">
            <h2 style="font-size:16px;margin:0 0 12px;">Customer</h2>
            <p style="margin:4px 0;font-size:14px;"><strong>${order.customerName}</strong></p>
            <p style="margin:4px 0;font-size:14px;">📞 <a href="tel:${order.customerPhone}">${order.customerPhone}</a></p>
            <p style="margin:4px 0;font-size:14px;">📧 <a href="mailto:${order.customerEmail}">${order.customerEmail}</a></p>

            <h2 style="font-size:16px;margin:20px 0 8px;">${order.deliveryType === "delivery" ? "🚚 Delivery" : "🏪 Pickup"}</h2>
            ${order.deliveryType === "delivery" ? `<p style="margin:4px 0;font-size:14px;">${order.deliveryAddress}, ${order.deliveryCity}</p>` : ""}

            <h2 style="font-size:16px;margin:20px 0 8px;">Items</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <thead>
                <tr style="border-bottom:2px solid #e7e5e4;">
                  <th style="text-align:left;padding:8px 0;">Item</th>
                  <th style="text-align:center;padding:8px 0;">Qty</th>
                  <th style="text-align:right;padding:8px 0;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${buildItemsHtml(order.items)}
              </tbody>
            </table>

            <div style="margin-top:16px;padding-top:12px;border-top:2px solid #e7e5e4;font-size:14px;">
              <p style="margin:4px 0;display:flex;justify-content:space-between;">
                <span>Subtotal</span> <strong>${formatCurrency(order.subtotal)}</strong>
              </p>
              ${order.deliveryFee > 0 ? `<p style="margin:4px 0;display:flex;justify-content:space-between;"><span>Delivery</span> <strong>${formatCurrency(order.deliveryFee)}</strong></p>` : ""}
              <p style="margin:8px 0 0;font-size:18px;display:flex;justify-content:space-between;">
                <strong>Total</strong> <strong style="color:#ea580c;">${formatCurrency(order.total)}</strong>
              </p>
            </div>

            ${order.notes ? `<div style="margin-top:16px;padding:12px;background:#fef3c7;border-radius:8px;font-size:13px;"><strong>Customer note:</strong> ${order.notes}</div>` : ""}
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send owner notification:", error);
    return { success: false, error };
  }
}

// Confirmation email to the customer
export async function sendCustomerConfirmation(order: OrderEmailData) {
  try {
    await resend.emails.send({
      from: "KOK Kitchen <orders@kokkitchen.co.uk>",
      to: order.customerEmail,
      subject: `Order Confirmed! #${order.ref} — KOK Kitchen`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;color:#1c1917;">
          <div style="background:#ea580c;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:white;margin:0;font-size:22px;">Thank you, ${order.customerName}!</h1>
            <p style="color:#fed7aa;margin:8px 0 0;font-size:14px;">Your order has been received</p>
          </div>

          <div style="background:#fafaf9;padding:24px;border:1px solid #e7e5e4;border-top:none;">
            <div style="text-align:center;padding:16px 0;border-bottom:1px solid #e7e5e4;">
              <p style="margin:0;font-size:13px;color:#78716c;">Order Reference</p>
              <p style="margin:4px 0 0;font-size:24px;font-weight:bold;color:#ea580c;">#${order.ref}</p>
            </div>

            <h2 style="font-size:16px;margin:20px 0 8px;">Your Order</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tbody>
                ${buildItemsHtml(order.items)}
              </tbody>
            </table>

            <div style="margin-top:16px;padding-top:12px;border-top:2px solid #e7e5e4;font-size:14px;">
              <p style="margin:4px 0;">Subtotal: <strong>${formatCurrency(order.subtotal)}</strong></p>
              ${order.deliveryFee > 0 ? `<p style="margin:4px 0;">Delivery: <strong>${formatCurrency(order.deliveryFee)}</strong></p>` : ""}
              <p style="margin:8px 0 0;font-size:18px;"><strong>Total: <span style="color:#ea580c;">${formatCurrency(order.total)}</span></strong></p>
            </div>

            <div style="margin-top:20px;padding:16px;background:white;border-radius:8px;border:1px solid #e7e5e4;font-size:14px;">
              <p style="margin:0 0 4px;"><strong>${order.deliveryType === "delivery" ? "🚚 Delivery to:" : "🏪 Pickup"}</strong></p>
              ${order.deliveryType === "delivery" ? `<p style="margin:0;color:#78716c;">${order.deliveryAddress}, ${order.deliveryCity}</p>` : `<p style="margin:0;color:#78716c;">We'll let you know when it's ready!</p>`}
            </div>
          </div>

          <div style="padding:20px;text-align:center;font-size:13px;color:#78716c;border:1px solid #e7e5e4;border-top:none;border-radius:0 0 12px 12px;">
            <p style="margin:0;">Questions? WhatsApp us at <a href="https://wa.me/44744782712" style="color:#ea580c;">+44 7447 82712</a></p>
            <p style="margin:8px 0 0;">KOK Kitchen — Authentic Nigerian Cuisine, Hertfordshire</p>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send customer confirmation:", error);
    return { success: false, error };
  }
}
