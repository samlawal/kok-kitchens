# KOK Kitchen — Website Handover Documentation

**Prepared by:** Ophir Digital — samuel@ophirdigital.com
**Date:** June 2026
**Live URL:** [kokkitchens.com](https://kokkitchens.com) (with `.co.uk`, `.online`, `.org` and `.store` redirecting to it)
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
| **Local** | £8.99 | Borehamwood, Radlett, Bushey, Watford (nearby), Barnet, Potters Bar | WD6, WD7, WD23, WD25, EN5, EN6 |
| **Extended** | £13.99 | Watford, Harrow, North London, St Albans, Hemel Hempstead | WD1-5, WD17-19, WD24, HA0-9, NW4/7/9/11, N2/3/11/12/14/20, EN1-4/7/8, AL1-4/10, HP1-3 |
| **Pickup** | Free | Collect from KOK Kitchen | — |
| **Out of area** | — | Customer sees "WhatsApp us to check" with a direct link | Everything else |

### How It Works for Customers

1. Customer adds items to cart and goes to checkout
2. They choose **Local**, **Extended**, or **Pickup**
3. They type their postcode — the system instantly shows:
   - ✅ Green tick for local (£8.99)
   - 🚚 Truck icon for extended (£13.99)
   - ⚠️ "WhatsApp us to check" for unknown areas
4. The order total updates automatically
5. Customers can also tap **"Order via WhatsApp"** to send their full cart as a WhatsApp message instead

### Test It Yourself

Try these postcodes on your checkout page to see it in action:

| Type this | Result |
|---|---|
| `WD7 8PQ` | ✅ Local — £8.99 (Radlett) |
| `WD6 1JN` | ✅ Local — £8.99 (Borehamwood) |
| `HA7 4LP` | 🚚 Extended — £13.99 (Stanmore) |
| `NW7 1QD` | 🚚 Extended — £13.99 (Mill Hill) |
| `AL1 3TJ` | 🚚 Extended — £13.99 (St Albans) |
| `E1 6AN` | ⚠️ Out of area — WhatsApp link |

### Expanding Your Delivery Area

As your business grows, we can easily add new postcodes to either the local or extended zone. Just tell us which areas you want to cover and we'll update it within 24 hours.

---

## Your Admin Panel

Your website has a **self-service admin panel** that lets you change photos, prices, availability, and equipment hire stock yourself — no waiting for a developer.

- **Web address:** [kokkitchens.com/admin](https://kokkitchens.com/admin)
- **Password:** the strong admin password set in Vercel (kept private — ask Ophir Digital if you don't have it on file). _The old default password is no longer accepted._

No technical knowledge needed — everything works from your phone or computer.

### Tab 1: Photos — update any dish photo

Replace any dish photo on your website in under 30 seconds.

1. Open the **Photos** tab.
2. **Select the dish** from the dropdown (all 55+ items listed).
3. You'll see the **current photo** displayed.
4. Tap **"Select image"** and pick a new photo from your phone or computer.
5. You'll see a **preview** of the new photo before confirming.
6. Tap **"Upload & Replace"** — the new photo is **live on your website immediately**.

**Key features:**
- Any image format works: JPG, PNG, HEIC (iPhone), WebP.
- Photos are **automatically resized and optimised** for fast loading.
- The original is **saved as a backup** — made a mistake? Tap **"Undo Last Change"** to revert.
- Maximum file size: 10 MB.

### Tab 2: Pricing — change any price instantly

Update any dish price without waiting for a developer.

1. Open the **Pricing** tab.
2. Browse by category, or use the **search bar** to find a dish quickly.
3. **Tap the price** next to any dish and type the new amount.
4. Changed prices are highlighted in **orange** so you can track edits.
5. When you're happy, tap **"Save"** at the top — new prices are **live immediately**.

**Key features:**
- Change **multiple prices at once** — the Save button shows pending count (e.g. "Save (3)").
- Custom prices show an **undo arrow** — tap to reset to the original.
- Search by **dish name or category**.
- Original prices are always kept as a fallback — you can never "lose" them.

### Tab 3: Availability — control what's on your menu

Perfect for stock management — mark items unavailable or hide them entirely.

| Status | What customers see | When to use |
|---|---|---|
| **Available** (green eye) | Normal — on the menu, orderable | Default for all dishes |
| **Temporarily Unavailable** (amber eye-off) | Greyed out with a "Temporarily Unavailable" badge — visible but can't order | Run out of an ingredient, pausing a dish |
| **Hidden** (red eye-off) | Completely removed from the menu | Seasonal items, discontinued dishes |

1. Open the **Availability** tab.
2. Find the dish via search or by browsing categories.
3. Each dish has **three icon buttons** on the right — tap the one you want; the change is **live instantly**.

**Common scenarios:**
- *"We ran out of Egusi today"* → tap amber eye-off → customers see it's temporarily unavailable → tap green eye tomorrow when it's back.
- *"We're removing Palm Wine for the summer"* → tap red eye-off → completely gone from the menu.
- *"Suya is back in season!"* → tap green eye → immediately available and orderable.

### Tab 4: Hire stock — manage equipment hire

Control how many of each item you actually own. Customers can only book what's in stock.

1. Open the **Hire stock** tab.
2. For each item (chafing dish, charger plate, etc.), set how many you own.
3. **Live availability** — the customer's date picker on `/hire` shows what's still bookable for their event date, after deducting any overlapping bookings.
4. The **Bookings** view below shows every hire enquiry — change status (enquiry → confirmed → out → returned → closed → cancelled) as the lifecycle moves on.

> Items you leave blank stay "unmanaged" (no stock cap — same behaviour as before the hire feature went live).

### What you can do yourself vs contact us

| Task | Self-service? | How |
|---|---|---|
| Change a dish photo | ✅ Yes | Admin Panel → **Photos** |
| Change a price (one or many) | ✅ Yes | Admin Panel → **Pricing** |
| Mark item unavailable / hide / bring back | ✅ Yes | Admin Panel → **Availability** |
| Undo a recent photo change | ✅ Yes | Admin Panel → **Photos → "Undo Last Change"** |
| Reset a price to original | ✅ Yes | Admin Panel → **Pricing → undo arrow** |
| Set hire stock counts | ✅ Yes | Admin Panel → **Hire stock** |
| Move a hire booking through its lifecycle | ✅ Yes | Admin Panel → **Hire stock → Bookings** |
| Add a brand new dish | ❌ Contact us | WhatsApp / email Ophir Digital |
| Change delivery zones or fees | ❌ Contact us | WhatsApp / email Ophir Digital |
| Update business hours | ❌ Contact us | WhatsApp / email Ophir Digital |
| Change the WhatsApp number or business email | ❌ Contact us | WhatsApp / email Ophir Digital |

---

## Preparing Photos for Your Website

When you're sending us a batch of photos (launch shoot or bulk update), this is how to prep them so we can match them to your dishes automatically.

### Naming convention

Name each file after the dish, using **hyphens between words** and **lowercase**:

| Dish name | File name |
|---|---|
| Jollof Rice | `jollof-rice.jpg` |
| Egusi Soup | `egusi-soup.jpg` |
| Peppered Chicken | `peppered-chicken.jpg` |
| Small Chops Platter | `small-chops-platter.jpg` |
| Pounded Yam & Efo Riro | `pounded-yam-efo-riro.jpg` |
| Fried Rice (Large) | `fried-rice-large.jpg` |

> **Don't stress about perfect names** — as long as they're clear we'll match them up. If in doubt, just name them something recognisable.

### File requirements

| Requirement | Details |
|---|---|
| **Format** | JPG, PNG, or HEIC (iPhone photos are fine) |
| **Minimum size** | 800 × 600 pixels (any modern phone camera exceeds this) |
| **Maximum size** | 10 MB per photo |
| **Orientation** | Landscape (wider than tall) works best — matches the card layout |
| **Background** | Clean and uncluttered — white plate, dark wood, or plain surface |
| **Packaging** | Plate the food on real dishes — avoid takeaway containers |

### Tips for great food photos

1. **Natural daylight** — shoot near a window, never use flash.
2. **Shoot from above** — looking straight down at the plate gives the cleanest result.
3. **Slight angle** — 45° works well for dishes with height (soups, stacked plates).
4. **Clean the plate edge** — wipe any drips or splashes before shooting.
5. **No filters** — we handle colour correction and optimisation.
6. **Fill the frame** — the dish should take up most of the photo.
7. **One dish per photo** — don't combine multiple items in one shot.

### How to send photos to us

| Method | Best for |
|---|---|
| **WhatsApp** | Quick batch of 5–15 photos — easiest |
| **Email** | Up to ~20 photos per email to `samuel@ophirdigital.com` |
| **Google Drive / Dropbox** | Large batches (20+) — share a folder link |
| **WeTransfer** | One-off large transfer — wetransfer.com (free) |

### Updating photos yourself once the site is live

You **don't need to contact us** to change individual dish photos — use the **Photos** tab in your Admin Panel (see above). Select the dish, upload the new photo from your phone, and it's live in seconds.

---

## Contact Points on Your Website

| Contact Method | Details | Where It Appears |
|---|---|---|
| **WhatsApp** | +44 7447 82712 | Floating button (every page), hero section, footer |
| **Email** | orders@kokkitchens.com | Footer |
| **Phone** | +44 7447 82712 | Footer |

The WhatsApp button has a pre-filled message: *"Hi KOK Kitchen! I'd like to place an order"*

---

## Growing Your Business — Reviews That Convert

After the launch, the single highest-ROI activity for KOK Kitchens is **getting customer reviews on Google**. Reviews drive new customers in three compounding ways: they push you up Google's local rankings, they remove the trust barrier for a first-time customer, and they make your catering enquiries close at a much higher rate.

### Why this matters (the honest numbers)
- **Google Business Profile is the #1 channel for "near me" searches.** When someone in Edgware searches "Nigerian food delivery", Google shows three businesses in a map box above everything else. The ones with **more recent reviews and a higher star rating sit at the top**. Without reviews, you don't appear.
- **88% of consumers trust online reviews as much as personal recommendations.** A new customer who's never heard of KOK reads your reviews before ordering. Five-star reviews from real people remove the *"is this place any good?"* hesitation.
- **For catering, reviews compound dramatically.** A glowing review of one wedding gets seen by the bride's friends — every guest is a potential future client. A single 5★ wedding review can convert to thousands of pounds of follow-on bookings.
- **More reviews = better placement = more orders = more reviews.** This is the flywheel. The first 20 reviews are the hardest; after that it builds itself.

### Where to focus (in priority order)
1. **Google Business Profile** — by far the most important. Set this up first.
2. **Instagram tagged posts** — customers posting their food and tagging `@kokkkitchen` is free advertising to their friends.
3. **TripAdvisor / Trustpilot** — lower priority for delivery-led businesses but they help if customers want to leave a review there.

### Step 1 — Set up Google Business Profile (one-time, ~20 min)
1. Go to **[google.com/business](https://www.google.com/business)** and sign in with a Google account.
2. Search for **"KOK Kitchens"** to claim the listing, or **Add your business** if there isn't one yet.
3. Fill in the essentials carefully — **the details must match what's on the website exactly** (this is called consistent NAP — Name, Address, Phone — and Google uses it to verify you're a real business):
   - **Business name:** KOK Kitchens
   - **Category:** Caterer (primary), Nigerian restaurant (secondary)
   - **Phone:** +44 7447 982712 (same as the website)
   - **Website:** https://kokkitchens.com
   - **Service area:** North London & Hertfordshire
   - **Hours:** Mon–Fri 10am–9pm · Sat 11am–10pm · Sun by pre-booking
4. **Verify the business** — Google will send a postcard with a code to your address (takes 5–14 days). Until verified, your listing isn't visible in search.
5. Once verified, **add 8–12 of your best food photos** and a logo.

### Step 2 — Get your "leave a review" link
This is the magic short URL you'll send to customers — it takes them straight to the review form with one tap.

1. Open the **Google Business Profile app** on your phone (or [business.google.com](https://business.google.com)).
2. Tap **Customers** → **Reviews** → **Share review form**.
3. Copy the link — it looks like `https://g.page/r/...` or `https://g.co/kgs/...`.
4. **Save this link somewhere you can grab it quickly** — pin it in your WhatsApp Notes, save as a phone shortcut, or write it on a sticky note by the till.

> **Already done for you:** the review sticker is built and waiting in your launch assets (gold-on-dark, "Loved your meal? Leave us a Google review", five stars). It points at **`kokkitchens.com/review`** — a permanent short URL we control. As soon as you give us your Google review link, we paste it into one setting and every printed sticker starts bouncing customers straight to the Google review form. **You never have to reprint** even if Google ever changes its URL format. _File: `assets/launch/review-qr-card.png` — print 500 round 5cm stickers from Solopress (~£25), drop one in every delivery bag._

### Step 3 — The two moments customers are most likely to review
Timing is everything. Asking at the right moment changes the response rate from ~5% to ~25%.

**Moment 1 — 30 minutes after a food delivery.** They've eaten, they're satisfied, the experience is fresh. **Don't wait 2 days** — by then the memory's faded and the WhatsApp message feels like nagging.

**Moment 2 — 2–3 days after a catering event.** Wait until the wedding/birthday buzz has settled. The host has shared photos, received compliments from guests, and is now in a happy nostalgic state. **This is when 5★ catering reviews land.**

### Step 4 — What to send (copy-paste templates)

**WhatsApp message after a food order** (send personally, not as a broadcast):
> Hi [Name] 👋 Hope you enjoyed your jollof tonight! If you've got 30 seconds, a quick Google review would mean the world to us — it's how new customers find us. 🙏
>
> Here's the link → [your Google review link]
>
> Thank you for supporting KOK Kitchens! 🧡

**WhatsApp message after a catering event** (send to the host 2–3 days after):
> Hi [Name] 🎉 I hope the wedding/birthday was everything you wanted, and the food brought smiles to your guests! We loved being part of it.
>
> If you can spare 2 minutes, a Google review really helps other families find us when they're planning their own celebrations. Here's the link → [your Google review link]
>
> Sending love, KOK Kitchens 🧡

**Sticker on every delivery bag** (we can design and print these — ask Ophir):
> Loved your meal? Tell Google!
> [QR code → Google review link]
> Your review helps us cook for more families ❤️

### Step 5 — Respond to every review (yes, every one)

**Positive reviews** — respond within 48 hours with a personal thank-you. Mention something specific from their review (the dish they loved, the event) so it doesn't look generic. *"Sarah, so glad the jollof was a hit at Tunde's christening — thanks for choosing us 🧡"*. Future customers read your replies too.

**Negative reviews (1–3 stars)** — respond within 24 hours, professionally, and **take the conversation offline**:
> *"Hi [Name], we're really sorry the order didn't meet your expectations. We'd love to make this right — please WhatsApp us on +44 7447 982712 and we'll personally sort it out. — KOK Kitchens"*
>
> A measured public response to a bad review is **more reassuring to future customers than no bad reviews at all**. It shows you care and you're real.

**Never argue publicly.** Never blame the customer. Never delete your replies. If the review is fake/abusive, **flag it through Google** — don't engage.

### What NOT to do — UK law on reviews (this matters)

The **Digital Markets, Competition and Consumers Act 2024** made several practices illegal with serious fines. Avoid every one of these:

- ❌ **Don't pay anyone to write a review** (including discounts/free food specifically *for a positive review*). Asking for an honest review is fine; tying a reward to a *positive* review is not.
- ❌ **Don't write your own reviews** or ask family/staff to. Google can detect this and penalise the entire listing.
- ❌ **Don't hide bad reviews** by only asking happy customers — the CMA banned this in 2024.
- ❌ **Don't post fake reviews of competitors**. Same act, same penalties.

**What's allowed:** asking *every* customer for an *honest* review — by WhatsApp, email, sticker, or in person. That's it. The good news is — for a kitchen producing the food you do, honest reviews are the ones you want.

### Realistic targets (the first 6 months)

| Month | Realistic target | How |
|---|---|---|
| **Month 1** | First 5 reviews | Ask every single delivery customer personally on WhatsApp. Ask every catering host 2 days after their event. |
| **Month 3** | 25 reviews | Sticker in every bag. Personal ask at every catering quote handover. |
| **Month 6** | 50 reviews | The flywheel starts — Google now ranks you in the local pack, new customers flow in, and they review unprompted. |

**Once you hit ~10 real reviews**, send them to Ophir — we'll wire them into the homepage testimonial section (currently hidden because we won't ship placeholder/fake quotes). Real reviews on the homepage are conversion gold.

---

## Print & Social Media Assets — What to Print and Where to Use

Everything listed below was created as part of your launch package. Files are in your `assets/launch/` folder. If you can't find a file, contact Ophir and we'll re-send it.

### Quick Reference

| Asset | File | What It's For | How to Print / Use |
|---|---|---|---|
| **Order QR Sticker** | `order-qr-sticker.png` | Customers scan → goes straight to your menu at kokkitchens.com/menu | Print as **5cm round stickers** (Solopress, ~£25 for 500). Stick on takeaway bags, flyers, business cards, market stall signage. |
| **Review QR Sticker** | `review-qr-card.png` | Customers scan → goes to kokkitchens.com/review → your Google review form | Print as **5cm round stickers** (same order as above). Drop one in **every delivery bag**. The QR points at a URL we control, so even if Google changes their link format, we update one setting and all printed stickers keep working — **never reprint**. |
| **Social Card (Square)** | `kok-launch-square.png` | 1080×1080 branded graphic — "Authentic Nigerian Cuisine, Delivered" | Post to **Instagram feed**, **Facebook**, **WhatsApp status**. Use as your profile/cover image if needed. |
| **Social Card (Story)** | `kok-launch-story.png` | 1080×1920 story-format graphic — same branding, vertical layout | Post to **Instagram Stories**, **WhatsApp Status**, **TikTok** cover. |
| **Promo Video** | `kok-promo.mp4` | Animated 15-second brand promo with Afrobeats audio | Post to **Instagram Reels**, **TikTok**, **Facebook**. Pin to top of your Instagram grid. |

### Printing Tips

- **QR stickers:** Order from [Solopress](https://www.solopress.com) or [Sticker Mule](https://www.stickermule.com/uk). Round 5cm, gloss or matte finish. 500 costs ~£25. You'll go through them fast — order 1000 if budget allows.
- **Both QR codes work right now** — the order QR goes to your live menu, the review QR goes to `/review` (which redirects to your Google review form once `GOOGLE_REVIEW_URL` is set in Vercel).
- **Flyers / table cards:** If you want A5 or A6 printed cards for catering events or market stalls, ask Ophir — we'll design them using the same brand assets.
- **Business cards:** We can add the order QR to one side and your contact details to the other. Let us know.

### Social Media Posting Guide

| Platform | What to Post | When |
|---|---|---|
| **Instagram Feed** | Square card (`kok-launch-square.png`) | Launch day, pin to top |
| **Instagram Reels** | Promo video (`kok-promo.mp4`) | Launch day + every 2 weeks |
| **Instagram Stories** | Story card (`kok-launch-story.png`) | Weekly — add "Order now" link sticker pointing to kokkitchens.com |
| **WhatsApp Status** | Story card or promo video | 2–3× per week (status expires after 24h) |
| **Facebook** | Square card + promo video | Launch day, then weekly food photos |
| **TikTok** | Promo video + kitchen cooking clips | Weekly |

### T-shirts, Banners & Aprons

These are print-ready SVG files in your `public/print-assets/` folder. SVGs scale to any size without losing quality — send them directly to the printer.

| Asset | File | What It's For | Printing Notes |
|---|---|---|---|
| **T-shirt Front** | `tshirt-front.svg` | Logo on front of staff t-shirts — "KOK Kitchens" wordmark + tagline | Send to screen printer or DTG (direct-to-garment). Works best on **black or dark** t-shirts (white + orange print). Chest placement. |
| **T-shirt Back** | `tshirt-back.svg` | Full back print — wordmark, dish list, website URL, phone number | Full back placement. Same dark fabric. The dish list is a conversation starter at events. |
| **Pull-up Banner** | `pull-up-banner.svg` | Standard 850×2000mm pull-up/roller banner for market stalls, catering events, pop-ups | Order from [Instantprint](https://www.instantprint.co.uk) or Vistaprint (~£35–50). Has a white QR placeholder — **ask Ophir to drop in the order QR before sending to printer**. |
| **Table Banner** | `table-banner.svg` | Wide 4:1 ratio banner for table fronts at market stalls and catering events | Print as vinyl banner or tablecloth wrap. Has a QR placeholder — same as above. |
| **Apron Logo** | `apron-logo.svg` | Chest logo for staff aprons — compact version of the wordmark | Send to an embroidery or print service. Works on black aprons. |

**Ordering t-shirts:** [Printful](https://www.printful.com/uk) or local screen printers. For 10+ shirts, screen printing is cheaper (~£8–12/shirt). For 1–5, DTG is easier (~£15–20/shirt). Always order a test print first.

**Important:** The QR placeholder boxes on the banner and table banner need the actual order QR code dropped in before printing. Send the files to Ophir and we'll insert the QR and return print-ready versions.

### Need More Assets?

Contact Ophir Digital — we can create additional materials (A-frame signage, branded packaging labels, event menus, business cards) using the same brand kit. All included in your ongoing support package.

---

## Behind the Scenes

Your site runs on modern, enterprise-grade infrastructure:

- **Secure hosting** with automatic backups and SSL across all five of your domains.
- **A real database** for orders and bookings — every order persists; nothing is lost on a server restart.
- **Card payments** through Stripe — your customers' card details never touch your server.
- **Transactional email + push notifications** so you hear about every order within seconds.
- **Performance-optimised images** served from a global CDN, cached aggressively.

The full engineering reference — providers, version-control history, environment configuration, runbooks — lives with the codebase. Ophir Digital holds the keys and operates everything for you; we're happy to share the technical details on request, or to walk a future technical hire through the stack.

---

## What's Included in Your Package

| Feature | Status |
|---|---|
| Responsive website (mobile + desktop) | ✅ Live |
| 55+ menu items with real photos + prices | ✅ Live |
| Online ordering with cart + side/drink upsells | ✅ Live |
| Stripe card payments + pay-on-delivery | ✅ Live |
| Order persisted to a real database | ✅ Live |
| Catering enquiry flow with email + push alerts | ✅ Live |
| Equipment hire — live stock + date-range bookings | ✅ Live |
| Email confirmations to owner + customer | ✅ Live |
| Push notifications to your phone (ntfy) | ✅ Live |
| WhatsApp contact button | ✅ Live |
| Category search & filtering | ✅ Live |
| About page | ✅ Live |
| Optimised images + blur placeholders | ✅ Live |
| SEO: titles, descriptions, sitemap, schema | ✅ Live |
| Per-area delivery pages (10 towns) for local search | ✅ Live |
| Custom domain `kokkitchens.com` with SSL | ✅ Live (with `.co.uk` / `.online` / `.org` / `.store` redirecting to it) |
| Privacy Policy + Terms + Allergens pages | ✅ Live (identity fields pending KOK) |
| `/review` redirect for the QR sticker | ✅ Live (links to your Google review form once `GOOGLE_REVIEW_URL` is set) |
| Google Analytics 4 | ⏳ Will add alongside the cookie-consent banner |
| Uber Direct courier delivery | ⏳ Activates when your Uber credentials land (flat-rate fallback live in the meantime) |

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
