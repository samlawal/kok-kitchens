"use client";

import { motion } from "framer-motion";

const testimonials = [
  { text: "Best jollof in Hertfordshire, hands down!", author: "Sarah W." },
  { text: "The egusi soup reminded me of home. Incredible.", author: "Chidi O." },
  { text: "Our wedding guests couldn't stop eating. Thank you KOK Kitchens!", author: "Temi & David" },
  { text: "Peppered chicken is addictive. We order every weekend now.", author: "James R." },
  { text: "Finally, real Nigerian food in Borehamwood!", author: "Funke A." },
  { text: "The small chops platter was a hit at our party.", author: "Michelle T." },
  { text: "Suya just like Lagos. 10/10.", author: "Emeka N." },
  { text: "Delivery was fast and everything was still hot. Impressed.", author: "Rachel K." },
];

// Double the array for seamless loop
const doubled = [...testimonials, ...testimonials];

export default function TestimonialMarquee() {
  return (
    <section className="bg-slate-900 py-10 overflow-hidden border-y border-slate-700">
      <div className="relative">
        <motion.div
          className="flex gap-8 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {doubled.map((t, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-full border border-slate-700 bg-slate-800/50"
            >
              <span className="text-orange-400 text-lg">&ldquo;</span>
              <p className="text-sm text-slate-300 whitespace-nowrap">
                {t.text}
              </p>
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                — {t.author}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-900 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
