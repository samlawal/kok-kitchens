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

### 2. Check Your Email

Order notification emails come from `orders@kokkitchen.co.uk`. Make sure to:
- Check your inbox (and spam folder initially)
- Add `orders@kokkitchen.co.uk` to your contacts so emails don't go to spam

---

## Your Website Pages

| Page | What It Does |
|---|---|
| **Homepage** (`/`) | Hero section, featured dishes, how it works, testimonials, catering CTA |
| **Menu** (`/menu`) | All 53 dishes with search, category filters, and add-to-cart |
| **Menu Item** (`/menu/jollof-rice-small-tray`) | Individual dish detail page with related items |
| **Catering** (`/catering`) | Event catering info with quote request form |
| **About** (`/about`) | Your story, mission, and values |
| **Checkout** (`/checkout`) | Customer details form, delivery/pickup toggle, order summary |
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

## Contact Points on Your Website

| Contact Method | Details | Where It Appears |
|---|---|---|
| **WhatsApp** | +44 7447 82712 | Floating button (every page), hero section, footer |
| **Email** | hello@kokkitchen.co.uk | Footer |
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
| Custom domain (kokkitchen.co.uk) | ⏳ Pending domain purchase/transfer |
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
