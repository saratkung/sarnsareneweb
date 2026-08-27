"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  // reset when the colour (and therefore the image set) changes
  useEffect(() => setActive(0), [images]);

  const current = images[Math.min(active, images.length - 1)] ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 md:flex-col">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative h-16 w-14 shrink-0 overflow-hidden bg-bg-secondary transition-opacity md:h-20 md:w-16",
                i === active ? "opacity-100 ring-1 ring-text-light" : "opacity-50 hover:opacity-80",
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* main image */}
      <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-bg-secondary">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src={current}
              alt={alt}
              fill
              priority
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
