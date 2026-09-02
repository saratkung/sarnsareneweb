"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReduceMotion } from "@/components/useReduceMotion";
import { featuredCollection } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal, CurtainImage, ChapterMark } from "@/components/Reveal";

// Each column drifts at a slightly different speed — an editorial spread,
// not a grid snapping into place.
const COLUMN_DRIFT = [18, 40, 26];

function ProductCard({
  product,
  description,
  drift,
}: {
  product: (typeof featuredCollection.products)[number];
  description: string;
  drift: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReduceMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);

  return (
    <div ref={ref} className="group">
      <motion.div style={reduce ? undefined : { y }}>
        <CurtainImage
          direction="up"
          parallax={40}
          scale={1.06}
          className="relative aspect-[3/4] w-full"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025]"
          />
        </CurtainImage>

        <div className="mt-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="section-title text-[19px] text-text-light">
              {product.name}
            </h3>
            <span className="caption text-text-light/40 shrink-0">
              {product.detail}
            </span>
          </div>
          <p className="body-copy text-[13px] mt-2 max-w-xs">{description}</p>
          <a
            href="#"
            className="inline-block mt-4 text-[9.5px] tracking-[0.3em] uppercase text-text-light/70 link-underline"
          >
            View Product
          </a>
        </div>
      </motion.div>
    </div>
  );
}

export default function FeaturedCollection() {
  const { lang } = useLanguage();

  return (
    <section
      id="collection"
      data-scroll-section
      data-mood="sand"
      data-rail="05"
      className="py-28 md:py-48"
    >
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-[auto_1fr] gap-y-10 md:gap-x-20">
          <Reveal className="md:pt-2">
            <ChapterMark index={5} total={5} />
          </Reveal>

          <div>
            <Reveal blur>
              <p className="eyebrow mb-6">{featuredCollection.eyebrow}</p>
              <h2 className="display text-[clamp(2.2rem,6vw,4.2rem)] text-text-light">
                {featuredCollection.title}
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <a
                href="#"
                className="inline-block mt-8 text-[10px] tracking-[0.3em] uppercase text-text-light border-b border-gold/50 pb-1 hover:border-gold transition-colors duration-500"
              >
                {featuredCollection.viewAll}
              </a>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 md:mt-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 md:gap-y-16">
          {featuredCollection.products.map((product, i) => (
            <ProductCard
              key={product.name}
              product={product}
              drift={COLUMN_DRIFT[i % 3]}
              description={
                lang === "en"
                  ? en.featuredCollection.products[i]?.description ?? product.description
                  : product.description
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
