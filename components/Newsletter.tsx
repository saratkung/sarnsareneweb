"use client";

import { useState, type FormEvent } from "react";
import { newsletter } from "@/lib/content";
import { Reveal } from "@/components/Reveal";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section className="bg-beige py-24 md:py-32">
      <div className="max-w-xl mx-auto px-6 md:px-10 text-center">
        <Reveal>
          <h2 className="font-serif font-normal uppercase tracking-[0.06em] text-bg text-[clamp(1.5rem,3.6vw,2.2rem)] mb-5">
            {newsletter.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-brown/80 text-[14px] leading-relaxed font-light mb-10">
            {newsletter.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          {submitted ? (
            <p className="text-[12px] tracking-widest2 uppercase text-brown">
              Thank you — welcome to SARNSARENE.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletter.placeholder}
                className="flex-1 px-5 py-3.5 bg-transparent border border-bg/25 text-bg placeholder:text-bg/40 text-[13px] outline-none focus:border-bg/60 transition-colors duration-300"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-bg text-text-light text-[10.5px] tracking-widest2 uppercase hover:bg-brown transition-colors duration-300"
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
