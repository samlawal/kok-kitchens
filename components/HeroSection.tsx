"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const heroSlides = [
  { src: "/meals/jollof-rice.jpg", label: "Party Jollof Rice" },
  { src: "/meals/scotch-bonnet-okra.jpg", label: "Fresh Nigerian Ingredients" },
  { src: "/meals/peppered-chicken.jpg", label: "Peppered Chicken" },
  { src: "/meals/egusi-soup.jpg", label: "Egusi Soup" },
  { src: "/meals/asun.jpg", label: "Asun" },
  { src: "/meals/fried-plantain.jpg", label: "Fried Plantain (Dodo)" },
  { src: "/meals/suya.jpg", label: "Suya" },
  { src: "/meals/okra-soup.jpg", label: "Okra Soup" },
  { src: "/meals/peppered-goat-meat.jpg", label: "Peppered Goat" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-orange-950 min-h-[90vh] flex items-center">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-6"
            >
              <Utensils className="h-5 w-5 text-orange-400" />
              <span className="text-sm font-medium text-orange-400 uppercase tracking-widest">
                Authentic Nigerian Cuisine
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight"
            >
              Taste the Soul of{" "}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 inline-block"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Nigeria
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 text-lg sm:text-xl text-stone-300 leading-relaxed max-w-xl"
            >
              From smoky party jollof to rich egusi soup — order
              authentic Nigerian meals for delivery across Hertfordshire,
              or let us cater your next event with unforgettable flavours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/menu"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-8 py-4 text-base font-semibold text-white hover:bg-orange-500 active:scale-[0.97] transition-all shadow-lg shadow-orange-600/25"
              >
                Order Now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="https://wa.me/4474478271?text=Hi%20Kok%20Kitchen!%20I%27d%20like%20to%20place%20an%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-green-600 px-8 py-4 text-base font-semibold text-white hover:bg-green-600 transition-all"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 flex flex-wrap items-center gap-6 sm:gap-8 text-sm text-stone-400"
            >
              {[
                { emoji: "🔥", text: "Made Fresh Daily" },
                { emoji: "🚚", text: "Fast Delivery" },
                { emoji: "🎉", text: "Event Catering" },
              ].map((item) => (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05, color: "#fb923c" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — auto-sliding food showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Main showcase frame */}
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={slide.src}
                    alt={slide.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 0vw, 448px"
                    priority={current === 0}
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Dish name label */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={current}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="text-xl font-bold text-white"
                  >
                    {slide.label}
                  </motion.p>
                </AnimatePresence>

                {/* Progress dots */}
                <div className="flex gap-2 mt-3">
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className="group relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                      style={{ width: i === current ? "2rem" : "0.75rem" }}
                      aria-label={`Slide ${i + 1}`}
                    >
                      <span className="absolute inset-0 bg-white/30 rounded-full" />
                      {i === current && (
                        <motion.span
                          className="absolute inset-0 bg-orange-400 rounded-full origin-left"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 4, ease: "linear" }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Kok Kitchen
                </div>
              </div>
            </div>

            {/* Glow behind the showcase */}
            <div className="absolute -inset-8 rounded-3xl bg-orange-500/10 blur-[60px] pointer-events-none -z-10" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-stone-600 flex justify-center pt-2">
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
