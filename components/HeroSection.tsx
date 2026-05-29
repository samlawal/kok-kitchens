"use client";

import Link from "next/link";
import { ArrowRight, Utensils } from "lucide-react";
import { motion } from "framer-motion";

const floatingEmojis = ["🍛", "🍗", "🔥", "🥘", "🍖", "🌶️"];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-orange-950 min-h-[90vh] flex items-center">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
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

      {/* Floating food emojis */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingEmojis.map((emoji, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl opacity-20 select-none"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
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
            <Link
              href="/catering"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-stone-600 px-8 py-4 text-base font-semibold text-white hover:border-orange-500 hover:text-orange-400 transition-colors"
            >
              Catering Services
            </Link>
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
            ].map((item, i) => (
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
