"use client";

import { Modal } from "@/components/ui/Modal";

const ROWS = [
  { size: "Compact", dims: "26 × 22 × 11 cm", volume: "≈ 6 L", carry: "Daily essentials" },
  { size: "Regular", dims: "34 × 28 × 13 cm", volume: "≈ 12 L", carry: "The everyday carry" },
  { size: "Weekender", dims: "42 × 34 × 16 cm", volume: "≈ 22 L", carry: "Travel & overnight" },
];

const POUCH_ROWS = [
  { size: "Small", dims: "16 × 11 cm", volume: "—", carry: "Cards, cables, keys" },
  { size: "Medium", dims: "22 × 15 cm", volume: "—", carry: "Passport & phone" },
];

export function SizeGuideModal({
  open,
  onClose,
  kind = "tote",
}: {
  open: boolean;
  onClose: () => void;
  kind?: "tote" | "pouch";
}) {
  const rows = kind === "pouch" ? POUCH_ROWS : ROWS;

  return (
    <Modal open={open} onClose={onClose} title="Size Guide">
      <p className="mb-6 text-[13px] leading-relaxed font-light text-text-muted">
        Measurements are width × height × depth. Woven pieces relax slightly with use, so
        each will soften to hold a little more than its stated volume.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-text-light/15 text-[9px] tracking-widest2 uppercase text-text-muted">
              <th className="py-3 pr-4 font-normal">Size</th>
              <th className="py-3 pr-4 font-normal">Dimensions</th>
              <th className="py-3 pr-4 font-normal">Volume</th>
              <th className="py-3 font-normal">Best for</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-text-light/10">
            {rows.map((r) => (
              <tr key={r.size} className="text-text-light">
                <td className="py-3 pr-4 font-serif text-[14px]">{r.size}</td>
                <td className="py-3 pr-4 tabular-nums text-text-muted">{r.dims}</td>
                <td className="py-3 pr-4 tabular-nums text-text-muted">{r.volume}</td>
                <td className="py-3 text-text-muted">{r.carry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-[11px] leading-relaxed text-text-muted">
        Still unsure? Write to us at <span className="text-text-light">care@sarnsarene.com</span>{" "}
        and we will help you choose.
      </p>
    </Modal>
  );
}
