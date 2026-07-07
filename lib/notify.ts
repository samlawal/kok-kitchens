// Push notifications via ntfy.sh (free, no account needed)
// Owner installs the ntfy app and subscribes to the topic

const NTFY_TOPIC = process.env.NTFY_TOPIC || "kok-kitchen-orders";
const NTFY_URL = `https://ntfy.sh/${NTFY_TOPIC}`;

// Payment method drives both the title prefix and the body's lead line.
// 'card'  → already paid by the customer; the driver collects nothing.
// 'cod'   → pay on delivery; the driver collects on arrival.
export type PaymentMethod = "card" | "cod";

interface OrderNotification {
  ref: string;
  customerName: string;
  customerPhone: string;
  deliveryType: string;
  paymentMethod: PaymentMethod;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

/** Title prefix + lead body line for a given payment method. The COD body
 *  line spells out the amount to collect, so the driver doesn't have to
 *  scroll to find the total.
 *
 *  IMPORTANT: `titlePrefix` MUST stay pure ASCII. It goes into the ntfy `Title`
 *  HTTP header, and HTTP headers require ISO-8859-1/ASCII per RFC 7230.
 *  Node's undici (Next's fetch) silently drops requests when it sees non-ASCII
 *  bytes in a header value — which is exactly how we lost every order push
 *  after shipping an emoji-prefixed title (see git blame / lib/notify.test.ts
 *  "keeps the Title header pure ASCII"). Emojis live in the body only. */
export function paymentLines(method: PaymentMethod, total: number): {
  titlePrefix: string;
  bodyLine: string;
} {
  if (method === "card") {
    return {
      titlePrefix: "PAID",
      bodyLine: `💳 PAID by card — no collection needed`,
    };
  }
  return {
    titlePrefix: "COD",
    bodyLine: `💷 PAY ON DELIVERY — collect £${total.toFixed(2)}`,
  };
}

// Current time as HH:MM in UK local time, for a "Placed HH:MM" line in alerts —
// so the owner can tell a fresh order from one they're reading 15 minutes late
// (ntfy's own arrival time can lag if the push is delayed). Europe/London keeps
// it correct across BST/GMT.
export function londonTime(d: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Pure — assemble the ntfy request WITHOUT sending. Extracted so the header
 *  contract (Title must be ASCII) can be unit-tested without stubbing fetch. */
export function buildPushRequest(order: OrderNotification): {
  url: string;
  headers: Record<string, string>;
  body: string;
} {
  const itemList = order.items
    .map((i) => `${i.quantity}x ${i.name}`)
    .join(", ");
  const { titlePrefix, bodyLine } = paymentLines(
    order.paymentMethod,
    order.total,
  );

  const body = [
    bodyLine,
    `Placed ${londonTime()}`,
    `${order.customerName} — ${order.deliveryType}`,
    `Items: ${itemList}`,
    `Total: £${order.total.toFixed(2)}`,
    `Phone: ${order.customerPhone}`,
  ].join("\n");

  return {
    url: NTFY_URL,
    headers: {
      // ASCII-only. See paymentLines() for the "why".
      Title: `${titlePrefix} - Order #${order.ref}`,
      Priority: "high",
      Tags: "fork_and_knife,moneybag",
      Actions: `view, Call Customer, tel:${order.customerPhone}`,
    },
    body,
  };
}

export async function sendPushNotification(order: OrderNotification) {
  const req = buildPushRequest(order);
  try {
    await fetch(req.url, {
      method: "POST",
      headers: req.headers,
      body: req.body,
    });
    return { success: true };
  } catch (error) {
    console.error("Push notification failed:", error);
    return { success: false, error };
  }
}
