"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "./MotionWrapper";

export default function CateringCTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-orange-700 py-20 sm:py-24">
      {/* Animated bg circles */}
      <motion.div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-orange-500/30"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-amber-400/20"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Planning an Event?
          </h2>
          <p className="mt-4 text-lg text-orange-100 leading-relaxed">
            From weddings and birthdays to corporate gatherings — our catering
            team will create a menu your guests won&apos;t stop talking about.
          </p>
          <motion.div
            className="mt-8"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/catering"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-orange-700 hover:bg-orange-50 transition-all shadow-lg group"
            >
              Get a Catering Quote
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
