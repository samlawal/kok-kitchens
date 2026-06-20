import HeroSection from "@/components/HeroSection";
import FeaturedMeals from "@/components/FeaturedMeals";
import WhyUsSection from "@/components/WhyUsSection";
import CateringCTA from "@/components/CateringCTA";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
// Hidden until real, attributable customer reviews exist (the marquee held
// placeholder quotes). Restore this import + the <TestimonialMarquee /> below.
// import TestimonialMarquee from "@/components/TestimonialMarquee";
import BudgetPicks from "@/components/BudgetPicks";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedMeals />
      <SectionDivider />
      <CateringCTA />
      <HowItWorks />
      <StatsSection />
      {/* <TestimonialMarquee /> — hidden until genuine reviews exist (was placeholders) */}
      <WhyUsSection />
      <SectionDivider />
      <BudgetPicks />
    </>
  );
}
