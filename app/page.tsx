import AnnouncementBar from "@/components/AnnouncementBar";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Philosophy from "@/components/Philosophy";
import OurStory from "@/components/OurStory";
import EasternInspiration from "@/components/EasternInspiration";
import HighlightQuote from "@/components/HighlightQuote";
import BrandManifesto from "@/components/BrandManifesto";
import Footer from "@/components/Footer";
import SectionTheme from "@/components/SectionTheme";

export default function Home() {
  return (
    <>
      <SectionTheme name="announcement">
        <AnnouncementBar />
      </SectionTheme>
      <SectionTheme name="nav">
        <Nav />
      </SectionTheme>
      <main>
        <SectionTheme name="hero">
          <Hero />
        </SectionTheme>
        <SectionTheme name="philosophy">
          <Philosophy />
        </SectionTheme>
        <SectionTheme name="ourStory">
          <OurStory />
        </SectionTheme>
        <SectionTheme name="eastern">
          <EasternInspiration />
        </SectionTheme>
        <SectionTheme name="quote">
          <HighlightQuote />
        </SectionTheme>
        <SectionTheme name="manifesto">
          <BrandManifesto />
        </SectionTheme>
      </main>
      <SectionTheme name="footer">
        <Footer />
      </SectionTheme>
    </>
  );
}
