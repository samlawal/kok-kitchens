"use client";

import { motion } from "framer-motion";
import { Search, ShoppingBag, PartyPopper } from "lucide-react";
import { FadeIn } from "./MotionWrapper";

const steps = [
  {
    num: "01",
    icon: Search,
    title: "Browse",
    desc: "Explore our menu of 50+ authentic Nigerian dishes",
  },
  {
    num: "02",
    icon: ShoppingBag,
    title: "Order",
    desc: "Add to cart and checkout — delivery or pickup",
  },
  {
    num: "03",
    icon: PartyPopper,
    title: "Enjoy",
    desc: "Fresh, hot Nigerian food delivered to your door",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 sm:py-24 bg-stone-50 overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-[0.25em] mb-3">
            Simple as 1-2-3
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            How It Works
          </h2>
        </FadeIn>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden sm:block absolute top-12 left-[16.666%] right-[16.666%] h-px">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-300 via-orange-400 to-orange-300"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              style={{ transformOrigin: "left" }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="text-center relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                {/* Numbered circle */}
                <motion.div
                  className="mx-auto w-24 h-24 rounded-full bg-white border-2 border-orange-200 flex items-center justify-center relative shadow-lg shadow-orange-100/50"
                  whileInView={{
                    borderColor: ["#fed7aa", "#f97316", "#fed7aa"],
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3 + 0.5,
                    repeat: 0,
                  }}
                >
                  <step.icon className="h-8 w-8 text-orange-500" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                    {step.num}
                  </span>
                </motion.div>

                <h3 className="mt-6 text-lg font-bold text-stone-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-stone-500 max-w-[200px] mx-auto leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
