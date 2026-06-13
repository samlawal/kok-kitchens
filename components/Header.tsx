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

  const navLinks = [
    { href: "/menu", label: "Menu" },
    { href: "/catering", label: "Catering" },
    { href: "/about", label: "About" },
  ];

  // Homepage: transparent → dark glass on scroll
  // Other pages: white → white with shadow on scroll (stays light)
  const headerBg = isHome
    ? scrolled
      ? "bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-black/10"
      : "bg-transparent border-b border-transparent"
    : scrolled
      ? "bg-white/95 backdrop-blur-xl border-b border-stone-200 shadow-sm"
      : "bg-white/95 backdrop-blur-md border-b border-stone-200";

  const isDark = isHome; // only dark text on homepage

  const textColor = isDark
    ? scrolled ? "text-white" : "text-white"
    : "text-stone-900";

  const linkColor = isDark
    ? "text-stone-300 hover:text-orange-400"
    : "text-stone-600 hover:text-orange-600";

  const iconColor = isDark
    ? "text-stone-300 hover:text-orange-400"
    : "text-stone-600 hover:text-orange-600";

  const accentColor = isDark
    ? "text-orange-400"
    : "text-orange-600";

  const underlineColor = isDark
    ? "bg-orange-400"
    : "bg-orange-600";

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
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChefHat className={`h-8 w-8 transition-colors duration-300 ${accentColor}`} />
            </motion.div>
            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${textColor}`}>
              KOK
              <span className={accentColor}> Kitchens</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors group ${linkColor}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full ${underlineColor}`} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Mobile "Order" pill — always visible on mobile */}
            <Link
              href="/menu"
              className="md:hidden inline-flex items-center rounded-full bg-orange-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-orange-500 transition-colors"
            >
              Order
            </Link>

            {/* Cart with total on desktop */}
            <motion.button
              onClick={() => setIsCartOpen(true)}
              className={`relative flex items-center gap-1.5 p-2 transition-colors ${iconColor}`}
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
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-[11px] font-bold text-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 ${iconColor}`}
              aria-label="Toggle menu"
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
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`md:hidden overflow-hidden border-t ${isDark ? "border-slate-700/50" : "border-stone-100"}`}
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                        isDark
                          ? "text-stone-300 hover:bg-slate-800 hover:text-orange-400"
                          : "text-stone-700 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
