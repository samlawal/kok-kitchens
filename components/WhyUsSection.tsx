"use client";

import { Flame, Truck, Users, Clock } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./MotionWrapper";
import { motion } from "framer-motion";

const features = [
  {
    icon: Flame,
    title: "Authentic Recipes",
    description:
      "Traditional Nigerian recipes passed down through generations, cooked with real ingredients — no shortcuts.",
  },
  {
    icon: Clock,
    title: "Made Fresh Daily",
    description:
      "Every meal is prepared fresh to order. No reheated leftovers, no frozen substitutes — just real food.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Hot meals delivered straight to your door. We keep it warm and get it to you fast.",
  },
  {
    icon: Users,
    title: "Event Catering",
    description:
      "From intimate dinners to large-scale events — we bring the full Nigerian food experience to your guests.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Why KokKitchens?
          </h2>
          <p className="mt-3 text-stone-500 max-w-lg mx-auto">
            We&apos;re not just another food delivery service — we&apos;re bringing
            the spirit of Nigerian cooking to every plate.
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <motion.div
                className="text-center group cursor-default"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-stone-900">{f.title}</h3>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">
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
