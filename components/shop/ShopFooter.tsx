import Link from "next/link";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Pieces", href: "/shop" },
      { label: "The Signature Line", href: "/shop?collection=signature" },
      { label: "Everyday", href: "/shop?collection=everyday" },
      { label: "Atelier Small Goods", href: "/shop?collection=atelier" },
    ],
  },
  {
    title: "Care",
    links: [
      { label: "Shipping & Returns", href: "/#" },
      { label: "Product Care", href: "/#" },
      { label: "Size Guide", href: "/#" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "House",
    links: [
      { label: "Our Story", href: "/#story" },
      { label: "The Meaning of the Name", href: "/#philosophy" },
      { label: "Journal", href: "/#" },
    ],
  },
];

export function ShopFooter() {
  return (
    <footer className="bg-bg border-t border-text-light/10 pt-16 pb-10">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-xl tracking-[0.25em] uppercase text-text-light mb-4">
              SARNSARENE
            </p>
            <p className="text-text-muted text-[11px] leading-relaxed font-light">
              Contemporary Thai weaving, quietly luxurious.
              <br />
              Bangkok, Thailand
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[10px] tracking-widest2 uppercase text-text-muted mb-5">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-text-muted hover:text-text-light transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hairline my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] tracking-wide text-text-muted">
          <span>© 2026 SARNSARENE. All rights reserved.</span>
          <span>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
