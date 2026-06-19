"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/menu-data";

export default function Header() {
  const { totalItems, totalPrice, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on Escape (keyboard accessibility)
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/menu", label: "Menu" },
    { href: "/catering", label: "Catering" },
    { href: "/hire", label: "Hire" },
    { href: "/about", label: "About" },
  ];

  // Force the solid (opaque) header when scrolled OR when the mobile menu is
  // open — otherwise the transparent homepage dropdown renders light-grey
  // links on the white page gap (~1.5:1) and is effectively invisible.
  const solid = scrolled || mobileMenuOpen;

  // Homepage: transparent (with a protective top scrim) → dark glass when solid
  // Other pages: white → white with shadow on scroll (stays light)
  const headerBg = isHome
    ? solid
      ? "bg-stone-950/90 backdrop-blur-xl border-b border-stone-800/50 shadow-lg shadow-black/10"
      : "bg-gradient-to-b from-stone-950/80 via-stone-950/45 to-stone-950/10 border-b border-transparent"
    : solid
      ? "bg-white/95 backdrop-blur-xl border-b border-stone-200 shadow-sm"
      : "bg-white/95 backdrop-blur-md border-b border-stone-200";

  const isDark = isHome; // only dark text on homepage

  // When the transparent header sits directly over the rotating hero photos,
  // give its text/icons a drop-shadow (matching the hero headline) so they stay
  // legible over bright food images. No shadow once the header is solid.
  const overHero = isHome && !solid;
  const heroShadow = overHero ? "drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]" : "";

  const textColor = isDark ? "text-white" : "text-stone-900";

  const linkColor = isDark
    ? "text-stone-200 hover:text-orange-300"
    : "text-stone-600 hover:text-orange-700";

  const activeLinkColor = isDark ? "text-orange-300" : "text-orange-700";

  const iconColor = isDark
    ? "text-stone-200 hover:text-orange-300"
    : "text-stone-600 hover:text-orange-700";

  const accentColor = isDark
    ? "text-orange-400"
    : "text-orange-700";

  const underlineColor = isDark
    ? "bg-orange-300"
    : "bg-orange-700";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${headerBg}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          <Link
            href="/"
            aria-label="KOK Kitchens — home"
            className="flex items-center gap-2 group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChefHat className={`h-8 w-8 transition-colors duration-300 ${accentColor} ${heroShadow}`} />
            </motion.div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${textColor} ${heroShadow}`}>
              KOK
              <span className={accentColor}> Kitchens</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative text-sm font-medium transition-colors group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${active ? activeLinkColor : linkColor} ${heroShadow}`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 transition-all ${active ? "w-full" : "w-0 group-hover:w-full"} ${underlineColor}`} />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Mobile "Order" pill — always visible on mobile */}
            <Link
              href="/menu"
              className="md:hidden inline-flex items-center rounded-full bg-orange-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-orange-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Order
            </Link>

            {/* Cart with total on desktop */}
            <motion.button
              onClick={() => setIsCartOpen(true)}
              className={`relative flex items-center gap-1.5 p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${iconColor} ${heroShadow}`}
              aria-label="Open cart"
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="hidden sm:inline text-xs font-semibold">
                  {formatPrice(totalPrice)}
                </span>
              )}
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-700 text-[11px] font-bold text-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${iconColor} ${heroShadow}`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`md:hidden overflow-hidden border-t ${isDark ? "border-stone-800/50" : "border-stone-100"}`}
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link, i) => {
                  const active = pathname === link.href;
                  return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                        isDark
                          ? active ? "bg-stone-800 text-orange-300" : "text-stone-200 hover:bg-stone-800 hover:text-orange-300"
                          : active ? "bg-orange-50 text-orange-700" : "text-stone-700 hover:bg-orange-50 hover:text-orange-700"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
