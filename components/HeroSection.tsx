"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FlameIcon, DeliveryIcon, ClocheIcon } from "./FeatureIcons";

const taglines = [
  "Party Jollof",
  "Egusi Soup",
  "Peppered Chicken",
  "Suya",
  "Asun",
  "Small Chops",
  "Fried Rice",
  "Pepper Soup",
];

const heroImages = [
  { src: "/meals/hero-c1.webp", alt: "KOK Kitchens spread" },
  { src: "/meals/hero-c2.webp", alt: "KOK Kitchens dish" },
  { src: "/meals/hero-c4.webp", alt: "KOK Kitchens platter" },
  { src: "/meals/hero-c5.webp", alt: "KOK Kitchens cuisine" },
  { src: "/meals/hero-c6.webp", alt: "KOK Kitchens food" },
  { src: "/meals/hero-c7.webp", alt: "KOK Kitchens meal" },
  { src: "/meals/hero-c8.webp", alt: "KOK Kitchens feast" },
  { src: "/meals/hero-c9.webp", alt: "KOK Kitchens table" },
  { src: "/meals/hero-c11.webp", alt: "KOK Kitchens serving" },
  { src: "/meals/hero-c15.webp", alt: "KOK Kitchens plate" },
  { src: "/meals/hero-c16.webp", alt: "KOK Kitchens special" },
];

const kenBurnsVariants = [
  { scale: [1.0, 1.25], x: ["0%", "5%"], y: ["0%", "3%"] },
  { scale: [1.1, 1.3], x: ["0%", "-5%"], y: ["0%", "-3%"] },
  { scale: [1.05, 1.2], x: ["-3%", "3%"], y: ["2%", "-2%"] },
  { scale: [1.1, 1.25], x: ["3%", "-3%"], y: ["-2%", "3%"] },
];

// Floating ember particles
function Embers() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            bottom: `-${Math.random() * 10}%`,
            background: `rgba(${200 + Math.random() * 55}, ${
              100 + Math.random() * 80
            }, ${20 + Math.random() * 40}, ${0.4 + Math.random() * 0.4})`,
          }}
          animate={{
            y: [0, -(400 + Math.random() * 600)],
            x: [0, (Math.random() - 0.5) * 200],
            opacity: [0, 0.8, 0.6, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function HeroBackground() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0"
            animate={kenBurnsVariants[current % kenBurnsVariants.length]}
            transition={{ duration: 6, ease: "linear" }}
          >
            <Image
              src={heroImages[current].src}
              alt={heroImages[current].alt}
              fill
              sizes="100vw"
              quality={90}
              className="object-cover"
              priority={current === 0}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Light overlay — lets food photos shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-950/30 to-stone-950/50" />
    </div>
  );
}

export default function HeroSection() {
  const [taglineIdx, setTaglineIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIdx((prev) => (prev + 1) % taglines.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-stone-950 min-h-[85vh] lg:min-h-[100vh] flex items-center justify-center">
      {/* Cinematic rolling food background */}
      <HeroBackground />

      {/* Floating embers */}
      <Embers />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <span className="h-px w-8 bg-orange-500/50" />
          <span className="text-xs font-semibold text-orange-400 uppercase tracking-[0.25em]">
            Hertfordshire, UK
          </span>
          <span className="h-px w-8 bg-orange-500/50" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold text-white leading-[0.95] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]"
        >
          <span className="block">KOK</span>
          <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500" style={{ backgroundSize: "200% 100%" }}>
            <motion.span
              className="inline-block"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, repeat: Infinity }}
              style={{
                backgroundSize: "200% 100%",
                backgroundImage: "linear-gradient(90deg, #fb923c, #fcd34d, #f97316, #fbbf24)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Kitchens
            </motion.span>
          </span>
        </motion.h1>

        {/* Rotating tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 h-10 flex items-center justify-center"
        >
          <span className="text-stone-300 text-lg sm:text-xl mr-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            Home of
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={taglineIdx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-lg sm:text-xl font-semibold text-orange-400"
            >
              {taglines[taglineIdx]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-6 text-base sm:text-lg text-stone-200 leading-relaxed max-w-2xl mx-auto drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]"
        >
          Authentic Nigerian cuisine made fresh daily. Order for delivery
          across Hertfordshire or let us cater your next event — from intimate
          dinners to celebrations of 200+.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/menu"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-10 py-4 text-base font-semibold text-white hover:bg-orange-500 active:scale-[0.97] transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30"
          >
            View Menu & Order
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/catering"
            className="hidden sm:inline-flex items-center justify-center gap-2 rounded-full border border-stone-700 px-10 py-4 text-base font-semibold text-stone-300 hover:border-orange-500/50 hover:text-white transition-all"
          >
            Catering Services
          </Link>
          <a
            href="https://wa.me/447447982712?text=Hi%20KOK%20Kitchens!%20I%27d%20like%20to%20place%20an%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-green-700/50 px-8 py-4 text-base font-semibold text-green-400 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
        </motion.div>

        {/* Glass feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {[
            {
              title: "Made Fresh",
              desc: "Cooked to order, never frozen",
              Icon: FlameIcon,
            },
            {
              title: "Fast Delivery",
              desc: "Across Hertfordshire & beyond",
              Icon: DeliveryIcon,
            },
            {
              title: "Event Catering",
              desc: "20 to 200+ guests, we handle it",
              Icon: ClocheIcon,
            },
          ].map((card) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm px-6 py-6 text-center hover:border-orange-500/20 hover:bg-white/[0.06] transition-colors"
            >
              {/* Animated icon on desktop, static on mobile */}
              <div className="hidden sm:flex justify-center mb-3">
                <card.Icon animated={true} />
              </div>
              <div className="flex sm:hidden justify-center mb-3">
                <card.Icon animated={false} />
              </div>
              <p className="text-sm font-semibold text-white">{card.title}</p>
              <p className="text-xs text-stone-500 mt-1">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-stone-700 flex justify-center pt-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-orange-400"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
