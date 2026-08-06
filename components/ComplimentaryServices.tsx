import { complimentaryServices } from "@/lib/content";
import { icons } from "@/components/Icon";
import { StaggerGroup, StaggerItem } from "@/components/Reveal";

export default function ComplimentaryServices() {
  return (
    <section className="bg-bg py-20 md:py-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {complimentaryServices.items.map((item) => {
            const Icon = icons[item.icon];
            return (
              <StaggerItem
                key={item.label}
                className="flex flex-col items-center text-center gap-4"
              >
                <Icon className="w-6 h-6 text-text-light" />
                <span className="text-[10px] tracking-widest2 uppercase text-text-muted leading-relaxed">
                  {item.label}
                </span>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
