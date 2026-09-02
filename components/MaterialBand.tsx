"use client";

import Image from "next/image";
import { CurtainImage } from "@/components/Reveal";

/**
 * A silent full-bleed plate of hand-woven fibre — a breath between
 * chapters. No copy: materiality carries it, per the brand's "Thai
 * identity through material + craftsmanship, not decoration" rule.
 */
export default function MaterialBand({
  src = "/images/weave-hero.png",
  className = "",
}: {
  src?: string;
  className?: string;
}) {
  return (
    <div className={`relative bg-[#1F1E1B] ${className}`}>
      <CurtainImage
        direction="up"
        parallax={110}
        scale={1.08}
        className="relative h-[52vh] min-h-[320px] w-full"
      >
        <Image
          src={src}
          alt="Hand-woven natural fibre, macro"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </CurtainImage>
      <div className="pointer-events-none absolute inset-0 bg-[#1F1E1B]/15" />
    </div>
  );
}
