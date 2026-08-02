import { philosophy } from "@/lib/content";
import { icons } from "@/components/Icon";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/Reveal";

export default function Philosophy() {
  return (
    <section id="philosophy" className="bg-bg-secondary py-24 md:py-32">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="text-center max-w-xl mx-auto mb-16 md:mb-20">
          <p className="eyebrow mb-4">{philosophy.eyebrow}</p>
          <h2 className="font-serif font-normal text-[28px] md:text-[32px] leading-snug text-text-light">
            {philosophy.title}
          </h2>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {philosophy.items.map((item) => {
            const Icon = icons[item.icon];
            return (
              <StaggerItem
                key={item.title}
                className="flex flex-col items-center text-center gap-5 px-2"
              >
                <Icon className="w-7 h-7 text-gold" />
                <h3 className="font-serif text-lg text-text-light">
                  {item.title}
                </h3>
                <p className="text-text-muted text-[13px] leading-relaxed font-light">
                  {item.description}
                </p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
