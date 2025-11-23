import FeaturedMenu from "@/components/homepage/featured-menu";
import HeroSection from "@/components/homepage/hero-section";
import OurStory from "@/components/homepage/our-story";
import Testimonials from "@/components/homepage/testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <OurStory />
      <FeaturedMenu />
      <Testimonials />
    </>
  );
}

