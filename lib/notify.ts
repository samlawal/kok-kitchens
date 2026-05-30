// Push notifications via ntfy.sh (free, no account needed)
// Owner installs the ntfy app and subscribes to the topic

const NTFY_TOPIC = process.env.NTFY_TOPIC || "kok-kitchen-orders";
const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`;

interface OrderNotification {
  ref: string;
  customerName: string;
  customerPhone: string;
  deliveryType: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

export async function sendPushNotification(order: OrderNotification) {
  const itemList = order.items
    .map((i) => `${i.quantity}x ${i.name}`)
    .join(", ");

  const body = [
    `${order.customerName} — ${order.deliveryType}`,
    `Items: ${itemList}`,
    `Total: £${order.total.toFixed(2)}`,
    `Phone: ${order.customerPhone}`,
  ].join("\n");

  try {
    await fetch(NTFY_URL, {
      method: "POST",
      headers: {
        Title: `New Order #${order.ref}`,
        Priority: "high",
        Tags: "fork_and_knife,moneybag",
        Actions: `view, Call Customer, tel:${order.customerPhone}`,
      },
      body,
    });
    return { success: true };
  } catch (error) {
    console.error("Push notification failed:", error);
    return { success: false, error };
  }
}
