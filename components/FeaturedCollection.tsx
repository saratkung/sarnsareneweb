"use client";

import Image from "next/image";
import { featuredCollection } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";

export default function FeaturedCollection() {
  const { lang } = useLanguage();

  return (
    <section id="collection" className="bg-bg py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="flex items-end justify-between gap-6 mb-16 md:mb-20">
          <div>
            <p className="eyebrow mb-4">{featuredCollection.eyebrow}</p>
            <h2 className="font-serif font-normal text-[28px] md:text-[32px] leading-snug text-text-light">
              {featuredCollection.title}
            </h2>
          </div>
          <a
            href="#"
            className="hidden sm:inline-flex items-center px-6 py-2.5 text-[10px] tracking-widest2 uppercase text-text-light border border-gold/50 rounded-full whitespace-nowrap hover:bg-gold hover:text-[#2B2B2B] hover:border-gold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-300"
          >
            {featuredCollection.viewAll}
          </a>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCollection.products.map((product, i) => (
            <StaggerItem key={product.name} className="group">
              <div className="relative aspect-[3/4] overflow-hidden mb-5 bg-bg rounded-lg shadow-lg shadow-black/25">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <h3 className="font-serif text-lg text-text-light mb-1">
                {product.name}
              </h3>
              <p className="text-text-muted text-[12.5px] leading-relaxed font-light mb-3">
                {lang === "en" ? en.featuredCollection.products[i]?.description ?? product.description : product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] tracking-widest2 uppercase text-text-muted">
                  {product.detail}
                </span>
                <a
                  href="#"
                  className="text-[9.5px] tracking-widest2 uppercase text-text-light border-b border-transparent hover:border-gold transition-colors duration-300"
                >
                  View Product
                </a>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
