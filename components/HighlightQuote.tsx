import { highlightQuote } from "@/lib/content";
import { Reveal } from "@/components/Reveal";

export default function HighlightQuote() {
  return (
    <section className="bg-bg-secondary py-28 md:py-40">
      <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
        <Reveal className="w-px h-14 bg-gold/60 mx-auto mb-10" />
        <Reveal delay={0.1}>
          <blockquote className="font-serif italic font-light text-text-light text-[clamp(1.5rem,4vw,2.6rem)] leading-[1.4]">
            &ldquo;{highlightQuote.quote}&rdquo;
          </blockquote>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 text-[10px] tracking-widest2 uppercase text-gold">
            {highlightQuote.attribution}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
