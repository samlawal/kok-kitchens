import HeroSection from "@/components/HeroSection";
import FeaturedMeals from "@/components/FeaturedMeals";
import WhyUsSection from "@/components/WhyUsSection";
import CateringCTA from "@/components/CateringCTA";
import StatsSection from "@/components/StatsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedMeals />
      <StatsSection />
      <WhyUsSection />
      <CateringCTA />
    </>
  );
}
