import { brand, footer } from "@/lib/content";

const socialMonograms: Record<string, string> = {
  Instagram: "IG",
  Facebook: "FB",
  Pinterest: "P",
  TikTok: "TT",
};

export default function Footer() {
  const followColumn = footer.columns.find((c) => c.title === "Follow Us");
  const otherColumns = footer.columns.filter((c) => c.title !== "Follow Us");

  return (
    <footer className="bg-bg pt-20 md:pt-28 pb-10">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8 mb-16">
          <div className="col-span-2 md:col-span-2">
            <p className="font-serif text-xl tracking-[0.25em] uppercase text-text-light mb-4">
              {brand.name}
            </p>
            <p className="text-text-muted text-[11px] leading-relaxed whitespace-pre-line font-light">
              {footer.tagline}
            </p>
          </div>

          {otherColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[10px] tracking-widest2 uppercase text-gold mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[12px] text-text-muted hover:text-text-light transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {followColumn && (
            <div>
              <h4 className="text-[10px] tracking-widest2 uppercase text-gold mb-5">
                {followColumn.title}
              </h4>
              <ul className="flex flex-wrap gap-3">
                {followColumn.items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      aria-label={item}
                      title={item}
                      className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-[9px] tracking-wide text-text-muted hover:border-gold hover:text-gold transition-colors duration-300"
                    >
                      {socialMonograms[item] ?? item.slice(0, 2).toUpperCase()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="hairline mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] tracking-wide text-text-muted">
          <span>{footer.copyright}</span>
          <span>{footer.legal}</span>
        </div>
      </div>
    </footer>
  );
}
