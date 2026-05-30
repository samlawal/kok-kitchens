import HeroSection from "@/components/HeroSection";
import FeaturedMeals from "@/components/FeaturedMeals";
import WhyUsSection from "@/components/WhyUsSection";
import CateringCTA from "@/components/CateringCTA";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import SectionDivider from "@/components/SectionDivider";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedMeals />
      <SectionDivider />
      <HowItWorks />
      <StatsSection />
      <TestimonialMarquee />
      <WhyUsSection />
      <SectionDivider />
      <CateringCTA />
    </>
  );
}
