import AnnouncementBar from "@/components/AnnouncementBar";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import OurStory from "@/components/OurStory";
import EasternInspiration from "@/components/EasternInspiration";
import SignatureExperience from "@/components/SignatureExperience";
import HighlightQuote from "@/components/HighlightQuote";
import BrandManifesto from "@/components/BrandManifesto";
import FeaturedCollection from "@/components/FeaturedCollection";
import JourneyForward from "@/components/JourneyForward";
import ComplimentaryServices from "@/components/ComplimentaryServices";
import Sustainability from "@/components/Sustainability";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Hero />
        <Philosophy />
        <OurStory />
        <EasternInspiration />
        <SignatureExperience />
        <HighlightQuote />
        <BrandManifesto />
        <FeaturedCollection />
        <JourneyForward />
        <ComplimentaryServices />
        <Sustainability />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
