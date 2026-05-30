import { ChefHat, Heart, Award, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about KOKKitchens — our story, our passion for authentic Nigerian cuisine, and our commitment to delivering the best food experience.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-gradient-to-b from-stone-900 to-stone-800 py-20 text-center">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Our Story
        </h1>
        <p className="mt-3 text-stone-400 max-w-md mx-auto">
          Where passion meets tradition
        </p>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-stone prose-lg max-w-none">
          <div className="rounded-2xl bg-white border border-stone-200 p-8 sm:p-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <h2 className="text-2xl font-bold text-stone-900 m-0">
                About KOKKitchens
              </h2>
            </div>
            <p className="text-stone-600 leading-relaxed text-lg">
              KOKKitchens was born from a simple love — the love for authentic
              Nigerian food made the way our grandmothers taught us. We believe
              every meal should tell a story, carry warmth, and bring people
              together.
            </p>
            <p className="text-stone-600 leading-relaxed text-lg mt-4">
              Whether you&apos;re craving a comforting plate of jollof rice
              on a quiet evening or planning a celebration that needs to
              feed hundreds, we bring the same care, quality, and authenticity
              to every single dish.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {[
              {
                icon: Heart,
                title: "Our Mission",
                text: "To make authentic Nigerian cuisine accessible to everyone — one plate, one event at a time.",
              },
              {
                icon: Award,
                title: "Quality Promise",
                text: "Fresh ingredients, traditional recipes, and no shortcuts. Every dish is made with intention.",
              },
              {
                icon: Users,
                title: "Community First",
                text: "We're more than a kitchen — we're part of your celebrations, your family dinners, your everyday joy.",
              },
              {
                icon: ChefHat,
                title: "Our Chefs",
                text: "A talented team of cooks who grew up with these recipes. They don't just cook — they pour their hearts in.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-white border border-stone-200 p-6"
              >
                <card.icon className="h-6 w-6 text-orange-600 mb-3" />
                <h3 className="font-semibold text-stone-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {card.text}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">
              Ready to taste the difference?
            </h2>
            <p className="text-orange-100 mb-6">
              Explore our menu or reach out for catering — we&apos;d love to
              cook for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/menu"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-50 transition-colors"
              >
                View Menu
              </a>
              <a
                href="/catering"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Catering Enquiry
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
