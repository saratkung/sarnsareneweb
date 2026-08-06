"use client";

import { useState, type FormEvent } from "react";
import { newsletter } from "@/lib/content";
import { en } from "@/lib/translations";
import { useLanguage } from "@/components/LanguageContext";
import { Reveal } from "@/components/Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { lang } = useLanguage();
  const subtitle = lang === "en" ? en.newsletter.subtitle : newsletter.subtitle;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-bg py-24 md:py-32">
      <div className="max-w-xl mx-auto px-6 md:px-10 text-center">
        <Reveal>
          <h2 className="font-serif font-normal uppercase tracking-[0.06em] text-text-light text-[clamp(1.5rem,3.6vw,2.2rem)] mb-5">
            {newsletter.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-text-muted text-[14px] leading-relaxed font-light mb-10">
            {subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          {submitted ? (
            <p className="text-[12px] tracking-widest2 uppercase text-text-muted">
              Thank you — welcome to SARNSARENE.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 sm:gap-0 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletter.placeholder}
                className="flex-1 px-5 py-3.5 bg-transparent border border-text-light/15 text-text-light placeholder:text-text-light/40 text-[13px] outline-none rounded-full sm:rounded-r-none focus:border-text-light/50 transition-colors duration-300"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-text-light text-bg text-[10.5px] tracking-widest2 uppercase rounded-full sm:rounded-l-none shadow-lg shadow-black/15 hover:bg-gold hover:text-[#2B2B2B] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
              >
                {newsletter.button}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
