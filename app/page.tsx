import Header from "./components/layout/Header";
import HomeHero from "./components/home/HomeHero";
import { HowTO } from "./components/home/HowTo";
import HomeDifference from "./components/home/HomeDifference";
import WhyChoose from "./components/home/WhyChoose";
import { Footer } from "./components/layout/Footer";

export default function Home() {
  return (
    <div> 
      <Header />
      <HomeHero />
      <HowTO />
      <WhyChoose />
      <HomeDifference />
      <Footer />

    </div>
    
    
  );
}
