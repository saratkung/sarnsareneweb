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
import SmoothScroll from "@/components/SmoothScroll";
import HomeScroll from "@/components/HomeScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <SectionTheme name="announcement">
        <AnnouncementBar />
      </SectionTheme>
      <SectionTheme name="nav">
        <Nav />
      </SectionTheme>

      {/* Fixed mood backdrop + 01–04 progress rail. */}
      <HomeScroll />

      {/* Content sits above the fixed mood backdrop (z-0). */}
      <div className="relative z-10">
        <main>
          <SectionTheme name="hero">
            <Hero />
          </SectionTheme>

          {/* The maison rises over the hero — content lifts across the dark edge. */}
          <div className="relative -mt-[8vh]">
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
          </div>
        </main>

        <SectionTheme name="footer">
          <Footer />
        </SectionTheme>
      </div>
    </SmoothScroll>
  );
}
