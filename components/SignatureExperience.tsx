"use client";

import { motion } from "framer-motion";
import { signatureExperience } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal, staggerContainer, staggerItem } from "@/components/Reveal";

export default function SignatureExperience() {
  const { lang } = useLanguage();

  return (
    <section className="bg-bg py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="text-center max-w-xl mx-auto mb-16 md:mb-20">
          <p className="eyebrow mb-4">{signatureExperience.eyebrow}</p>
          <h2 className="font-serif font-normal text-[28px] md:text-[32px] leading-snug text-text-light">
            {signatureExperience.title}
          </h2>
        </Reveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {signatureExperience.cards.map((card, i) => (
            <motion.div
              key={card.title}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="group border border-text-light/8 p-10 flex flex-col gap-5 transition-colors duration-500 hover:border-gold/50 hover:bg-bg-secondary"
            >
              <span className="text-[11px] tracking-widest2 text-text-muted font-sans">
                0{i + 1}
              </span>
              <h3 className="font-serif text-xl text-text-light">
                {card.title}
              </h3>
              <p className="text-text-muted text-[13px] leading-relaxed font-light">
                {lang === "en" ? en.signatureExperience.cards[i]?.description ?? card.description : card.description}
              </p>
              <span className="mt-2 w-8 h-px bg-gold/50 transition-all duration-500 group-hover:w-16" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
