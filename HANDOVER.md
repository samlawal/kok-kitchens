# KOK Kitchen — Website Handover Documentation

**Prepared by:** Ophir Digital — samuel@ophirdigital.com
**Date:** May 2026
**Live URL:** [TBC — pending custom domain]
**Vercel Project:** kok-kitchens

---

## How Your Website Works

### Order Flow

When a customer places an order on your website, this is what happens automatically:

```
Customer places order on your website
  │
  ├── ✅ Saved to database (Neon Postgres — secure, backed up)
  │
  ├── 📧 Email to YOU (branded HTML with full order details)
  │     • Customer name, phone, email
  │     • Every item + quantities + prices
  │     • Delivery or pickup
  │     • Total amount
  │     • Any customer notes
  │
  ├── 📧 Email to CUSTOMER (order confirmation)
  │     • Order reference number (e.g. KOK-260530-7HXF)
  │     • Items ordered + total
  │     • Delivery address
  │     • Your WhatsApp contact for questions
  │
  └── 🔔 Push notification to YOUR PHONE (instant alert)
        • Pings immediately when order comes in
        • Shows customer name, items, total
        • One-tap "Call Customer" button
        • Works even when phone is locked
```

### Order Reference Numbers

Every order gets a unique reference like **KOK-260530-7HXF**:
- `KOK` — your business
- `260530` — date (2026, May 30th)
- `7HXF` — unique code

Use this reference when communicating with customers about their order.

---

## Setup You Need to Do (One-Time)

### 1. Phone Notifications (2 minutes)

To receive instant order alerts on your phone:

1. **Download the ntfy app**
   - iPhone: [App Store](https://apps.apple.com/app/ntfy/id1625396347)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=io.heckel.ntfy)
2. **Open the app**
3. **Tap the + button → Subscribe**
4. **Type:** `kok-kitchen-orders`
5. **Tap Subscribe**

That's it! You'll now get a push notification every time someone orders.

> **Tip:** In the ntfy app settings, enable "Priority: High notifications" so order alerts bypass Do Not Disturb mode.

### 2. Photo Manager (Update Dish Photos)

You can update any dish photo yourself — no need to contact us.

1. **Go to:** [https://kokkitchens.com/admin](https://kokkitchens.com/admin)
2. **Password:** the admin password set in Vercel (kept private — ask Ophir Digital if you don't have it on file). _The old default password no longer works._
3. **Select the dish** you want to update from the dropdown
4. **Upload a new photo** — any format from your phone (JPG, PNG, HEIC)
5. **Done** — the photo is automatically resized, optimized, and live on the site instantly

> **Made a mistake?** Click "Undo Last Change" to revert to the previous photo.

**Tips for great photos:**
- Use natural daylight (near a window)
- Shoot from above, looking down at the dish
- Use a clean, plain surface (white plate, dark wood)
- Avoid flash — it washes out food colours

### 3. Check Your Email

Order notification emails come from `orders@kokkitchens.com`. Make sure to:
- Check your inbox (and spam folder initially)
- Add `orders@kokkitchens.com` to your contacts so emails don't go to spam

---

## Before You Trade — Insurance, Legal & Compliance

> ⚠️ These are business/legal steps **outside the website itself**, listed here so nothing is missed. Please confirm the details with a specialist insurance broker and, where needed, a solicitor — this is a checklist, not formal legal or insurance advice. A specialist **"caterers' insurance"** package usually bundles most of the insurances below into one policy.

**Insurance**
- [ ] **Public Liability** — covers injury to customers/guests or damage to their property at events or on delivery. Many venues require **£5m** cover before they'll let you cater.
- [ ] **Product Liability** — covers claims that your food caused harm (e.g. food poisoning, an allergic reaction). Essential for any food business; usually bundled with public liability.
- [ ] **Employers' Liability** — **legally required** (minimum £5m) the moment you have any staff or casual event helpers. Don't skip it if anyone helps you at events.
- [ ] **Vehicle cover for deliveries** — if you deliver in your own vehicle, your policy must include **"hire and reward" / business use**. A normal car policy does **not** cover paid deliveries. (Not needed if delivery is always via couriers.)
- [ ] **Equipment / hire-stock cover** — for your own kitchen equipment and the items you hire out (chafing dishes, charger plates, etc.).
- [ ] **Professional indemnity** _(optional)_ — useful if you give menu/dietary advice or sign catering contracts. Often included in caterer packages.

**Legal & regulatory**
- [ ] **Register as a food business** with your local council's Environmental Health team — required at least **28 days before** you start trading (it's free).
- [ ] **Food hygiene** — a Level 2 Food Safety certificate for anyone handling food, a written food-safety (HACCP) system, and your food hygiene rating inspection.
- [ ] **Allergen information** — provide the 14-allergen info for your dishes (also on the website to-do); use full ingredient labels on anything pre-packed (Natasha's Law).
- [ ] **ICO data-protection registration** — register and pay the annual fee; it covers the customer data the website collects.
- [ ] **Alcohol licence** — only if you'll ever serve or sell alcohol at events.

---

## Your Website Pages

| Page | What It Does |
|---|---|
| **Homepage** (`/`) | Hero section, featured dishes, how it works, testimonials, catering CTA |
| **Menu** (`/menu`) | All 53 dishes with search, category filters, and add-to-cart |
| **Menu Item** (`/menu/jollof-rice-small-tray`) | Individual dish detail page with related items |
| **Catering** (`/catering`) | Event catering info with quote request form |
| **About** (`/about`) | Your story, mission, and values |
| **Checkout** (`/checkout`) | Postcode-based delivery pricing, customer form, order summary, WhatsApp option |
| **Order Success** (`/checkout/success`) | Confirmation page after order is placed |

---

## Menu & Pricing

Your menu is stored in the website code at `lib/menu-data.ts`. It contains **53 items** across 7 categories:

| Category | Items | Price Range |
|---|---|---|
| Rice Dishes | Jollof Rice, Fried Rice, Ofada, Noodles | £25 – £50 |
| Soups & Swallows | Egusi, Efo Riro, Okra, Ogbono, Gbegiri, Pepper Soup, Ayamase, Stews, Pounded Yam, Amala | £2 – £55 |
| Grills & Proteins | Peppered Fish/Chicken/Beef/Goat/Turkey/Snail, Asun, Suya, Stick Meat | £2.50 – £130 |
| Sides | Dodo, Fried Yam, Beans, Yam Pottage, Moi-Moi, Salad | £2.50 – £40 |
| Snacks | Puff Puff, Meat/Fish Pies, Spring Rolls, Samosa, Sausage Roll | £1.20 – £20 |
| Drinks | Chapman, Zobo, Palm Wine, Kunu, Tiger Nut, Ginger | £3.49 – £8.99 |
| Party Packs | Jollof/Fried Rice Coolers, Stew Big Pot, Small Chops Platter | £50 – £120 |

**To update prices or add new dishes:** Contact Ophir Digital. We'll update the menu and deploy within 24 hours.

---

## Delivery Zones & Pricing

Your checkout automatically detects the customer's delivery zone when they type their postcode. The price adjusts in real-time:

| Zone | Delivery Fee | Areas | Postcodes |
|---|---|---|---|
| **Local** | £4.99 | Borehamwood, Radlett, Bushey, Watford (nearby), Barnet, Potters Bar | WD6, WD7, WD23, WD25, EN5, EN6 |
| **Extended** | £7.99 | Watford, Harrow, North London, St Albans, Hemel Hempstead | WD1-5, WD17-19, WD24, HA0-9, NW4/7/9/11, N2/3/11/12/14/20, EN1-4/7/8, AL1-4/10, HP1-3 |
| **Pickup** | Free | Collect from KOK Kitchen | — |
| **Out of area** | — | Customer sees "WhatsApp us to check" with a direct link | Everything else |

### How It Works for Customers

1. Customer adds items to cart and goes to checkout
2. They choose **Local**, **Extended**, or **Pickup**
3. They type their postcode — the system instantly shows:
   - ✅ Green tick for local (£4.99)
   - 🚚 Truck icon for extended (£7.99)
   - ⚠️ "WhatsApp us to check" for unknown areas
4. The order total updates automatically
5. Customers can also tap **"Order via WhatsApp"** to send their full cart as a WhatsApp message instead

### Test It Yourself

Try these postcodes on your checkout page to see it in action:

| Type this | Result |
|---|---|
| `WD7 8PQ` | ✅ Local — £4.99 (Radlett) |
| `WD6 1JN` | ✅ Local — £4.99 (Borehamwood) |
| `HA7 4LP` | 🚚 Extended — £7.99 (Stanmore) |
| `NW7 1QD` | 🚚 Extended — £7.99 (Mill Hill) |
| `AL1 3TJ` | 🚚 Extended — £7.99 (St Albans) |
| `E1 6AN` | ⚠️ Out of area — WhatsApp link |

### Expanding Your Delivery Area

As your business grows, we can easily add new postcodes to either the local or extended zone. Just tell us which areas you want to cover and we'll update it within 24 hours.

---

## Contact Points on Your Website

| Contact Method | Details | Where It Appears |
|---|---|---|
| **WhatsApp** | +44 7447 82712 | Floating button (every page), hero section, footer |
| **Email** | orders@kokkitchens.com | Footer |
| **Phone** | +44 7447 82712 | Footer |

The WhatsApp button has a pre-filled message: *"Hi KOK Kitchen! I'd like to place an order"*

---

## Technical Details (For Reference)

### Technology Stack
- **Framework:** Next.js 16 (React)
- **Hosting:** Vercel (auto-deploys when code is updated)
- **Database:** Neon Postgres (orders stored securely)
- **Email:** Resend (order confirmation emails)
- **Notifications:** ntfy.sh (instant push to your phone)
- **Images:** Optimised WebP format, extracted from your price list PDF

### Environment Variables (set in Vercel)
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `RESEND_API_KEY` | Email sending service |
| `NOTIFICATION_EMAIL` | Your email for order alerts |
| `NTFY_TOPIC` | Push notification channel name |

### Repository
- **GitHub:** github.com/samlawal/kok-kitchens
- **Branch:** main (auto-deploys to Vercel on push)

---

## What's Included in Your Package

| Feature | Status |
|---|---|
| Responsive website (mobile + desktop) | ✅ Live |
| 53 menu items with real photos + prices | ✅ Live |
| Online ordering with cart | ✅ Live |
| Order saved to database | ✅ Live |
| Email notifications (owner + customer) | ✅ Ready (needs Resend API key) |
| Push notifications to phone | ✅ Ready (install ntfy app) |
| WhatsApp contact button | ✅ Live |
| Category search & filtering | ✅ Live |
| Catering enquiry page | ✅ Live |
| About page | ✅ Live |
| Optimised images (WebP, blur placeholders) | ✅ Live |
| SEO meta tags | ⏳ Pending custom domain |
| Stripe card payments | ⏳ Pending your Stripe account |
| Custom domain (kokkitchens.com) | ✅ Live — DNS + SSL on Vercel (.co.uk/.online/.org/.store redirect to it) |
| Privacy Policy + Terms | ⏳ Pending your review |
| Google Analytics | ⏳ Pending GA4 setup |

---

## Support & Maintenance

For any changes, issues, or questions:

- **Email:** samuel@ophirdigital.com
- **WhatsApp:** [Sam's number]
- **Response time:** Within 24 hours on business days

### Common Requests
| Request | Typical Turnaround |
|---|---|
| Update a price | Same day |
| Add a new dish | Same day |
| Update photos | Same day |
| Add a new page | 1–2 days |
| Bug fix | Same day |
| New feature | 2–5 days (quoted separately) |

---

*Ophir Digital — ophirdigital.com*
