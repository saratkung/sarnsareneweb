import Image from "next/image";
import { ourStory } from "@/lib/content";
import { Reveal } from "@/components/Reveal";

export default function OurStory() {
  return (
    <section id="story" className="bg-bg py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-20 items-center">
        <Reveal className="relative aspect-[4/5] overflow-hidden order-2 md:order-1">
          <Image
            src={ourStory.image}
            alt="SARNSARENE brand origins"
            fill
            className="object-cover"
          />
          <div className="absolute inset-4 border border-gold/30 pointer-events-none" />
        </Reveal>

        <Reveal delay={0.15} className="order-1 md:order-2">
          <p className="eyebrow mb-4">{ourStory.eyebrow}</p>
          <h2 className="font-serif font-normal text-[28px] md:text-[32px] leading-snug text-text-light mb-8">
            {ourStory.title}
          </h2>
          <div className="space-y-5">
            {ourStory.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-text-muted text-[14px] leading-[1.9] font-light"
              >
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
