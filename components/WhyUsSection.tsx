"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "./MotionWrapper";
import { motion } from "framer-motion";
import { FlameIcon, DeliveryIcon, ClocheIcon } from "./FeatureIcons";
import { ShieldCheck } from "lucide-react";

const features = [
  {
    Icon: () => <FlameIcon animated={true} />,
    StaticIcon: () => <FlameIcon animated={false} />,
    title: "Authentic Recipes",
    description:
      "Traditional Nigerian recipes passed down through generations, cooked with real ingredients — no shortcuts.",
  },
  {
    Icon: () => (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <motion.circle cx="20" cy="20" r="14" fill="#f97316" opacity="0.1" stroke="none" />
        <motion.circle cx="20" cy="20" r="14"
          animate={{ strokeDashoffset: [88, 0] }}
          transition={{ duration: 2, ease: "easeOut" }}
          strokeDasharray="88"
        />
        <motion.path d="M20 10v10l6 4"
          animate={{ pathLength: [0, 1] }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        />
      </svg>
    ),
    StaticIcon: () => (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="20" cy="20" r="14" fill="#f97316" opacity="0.1" stroke="none" />
        <circle cx="20" cy="20" r="14" />
        <path d="M20 10v10l6 4" />
      </svg>
    ),
    title: "Made Fresh Daily",
    description:
      "Every meal is prepared fresh to order. No reheated leftovers, no frozen substitutes — just real food.",
  },
  {
    Icon: () => <DeliveryIcon animated={true} />,
    StaticIcon: () => <DeliveryIcon animated={false} />,
    title: "Fast Delivery",
    description:
      "Hot meals delivered straight to your door across Hertfordshire. We keep it warm and get it to you fast.",
  },
  {
    Icon: () => <ClocheIcon animated={true} />,
    StaticIcon: () => <ClocheIcon animated={false} />,
    title: "Event Catering",
    description:
      "From intimate dinners to large-scale events — we bring the full Nigerian food experience to your guests.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-20 sm:py-24 bg-stone-950 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/[0.03] blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-[0.25em] mb-3">
            The KOK Difference
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Why KOKKitchens?
          </h2>
          <p className="mt-3 text-stone-400 max-w-lg mx-auto">
            We&apos;re not just another food delivery service — we&apos;re bringing
            the spirit of Nigerian cooking to every plate.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <motion.div
                className="text-center group cursor-default rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm px-6 py-8 hover:border-orange-500/20 hover:bg-white/[0.06] transition-all"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Animated on desktop */}
                <div className="hidden sm:flex justify-center mb-5">
                  <f.Icon />
                </div>
                {/* Static on mobile */}
                <div className="flex sm:hidden justify-center mb-5">
                  <f.StaticIcon />
                </div>
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-stone-400 leading-relaxed">
                  {f.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
