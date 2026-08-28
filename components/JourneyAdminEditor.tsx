"use client";

// ============================================================
// SARNSARENE — /admin/journey editor.
// Edits lib/journey.content.json (via /api/journey) and the six
// /journey images (via /api/upload). Dev-only, like /admin/site.
//
// To add / relabel a field: edit GROUPS below. Paths are dot-paths
// into the JSON (e.g. "content.beginning.heading.th",
// "sections.2.accent").
// ============================================================

import { useCallback, useState } from "react";

type Field = { path: string; label: string; type?: "text" | "textarea" | "color" };
type ImageSlot = { slot: string; pathForSrc: string; label: string };
type Group = {
  id: string;
  n: string;
  th: string;
  en: string;
  open?: boolean;
  image?: ImageSlot;
  fields: Field[];
};

// section index in the JSON `sections` array
const CHAPTERS = [
  { key: "beginning", i: 0, n: "01", th: "จุดเริ่มต้น", en: "The Beginning" },
  { key: "inspiration", i: 1, n: "02", th: "แรงบันดาลใจ", en: "The Inspiration" },
  { key: "philosophy", i: 2, n: "03", th: "ปรัชญา", en: "The Philosophy" },
  { key: "making", i: 3, n: "04", th: "การสร้างสรรค์", en: "The Making" },
  { key: "collection", i: 4, n: "05", th: "คอลเลกชันแรก", en: "The First Collection" },
  { key: "continues", i: 5, n: "06", th: "การเดินทางต่อไป", en: "The Journey Continues" },
] as const;

const colorTrio = (i: number): Field[] => [
  { path: `sections.${i}.bg`, label: "สีพื้นหลัง", type: "color" },
  { path: `sections.${i}.ink`, label: "สีตัวอักษร", type: "color" },
  { path: `sections.${i}.accent`, label: "สีเน้น (เส้น/เลข)", type: "color" },
];

const bilingual = (path: string, label: string, type: "text" | "textarea" = "text"): Field[] => [
  { path: `${path}.th`, label: `${label} (ไทย)`, type },
  { path: `${path}.en`, label: `${label} (อังกฤษ)`, type },
];

const GROUPS: Group[] = [
  {
    id: "meta",
    n: "00",
    th: "ทั่วไป & Hero",
    en: "Meta & Hero",
    open: true,
    image: { slot: "journey-hero", pathForSrc: "hero.image", label: "ภาพ Hero (ผ้าทอ close-up โทนเข้ม)" },
    fields: [
      { path: "meta.title", label: "ชื่อหน้า (browser tab / share)" },
      { path: "meta.description", label: "คำอธิบายหน้า (share)", type: "textarea" },
      { path: "meta.brand", label: "ชื่อแบรนด์ (มุมซ้ายบน)" },
      { path: "meta.sideLabel", label: "ข้อความแนวตั้งขอบซ้าย" },
      ...bilingual("meta.backLabel", "ปุ่มกลับหน้าหลัก"),
      { path: "meta.backHref", label: "ลิงก์ปุ่มกลับ" },
      { path: "hero.lineTop", label: "Hero — บรรทัดบน" },
      { path: "hero.lineMid", label: "Hero — บรรทัดกลาง" },
      { path: "hero.lineBottom", label: "Hero — บรรทัดล่าง" },
      ...bilingual("hero.scrollCue", "ข้อความ Scroll cue"),
    ],
  },
  {
    id: "menu",
    n: "0M",
    th: "เมนู (overlay)",
    en: "Menu",
    fields: [
      ...bilingual("menu.siteLinks.0.label", "ลิงก์ 1 — ข้อความ"),
      { path: "menu.siteLinks.0.href", label: "ลิงก์ 1 — URL" },
      ...bilingual("menu.siteLinks.1.label", "ลิงก์ 2 — ข้อความ"),
      { path: "menu.siteLinks.1.href", label: "ลิงก์ 2 — URL" },
    ],
  },
  ...CHAPTERS.map((ch): Group => {
    const base = `content.${ch.key}`;
    const fields: Field[] = [
      ...colorTrio(ch.i),
      ...bilingual(`sections.${ch.i}.kicker`, "หัวข้อเล็ก (kicker)"),
      ...bilingual(`${base}.heading`, "หัวข้อใหญ่ (ขึ้นบรรทัดใหม่ด้วย Enter)", "textarea"),
    ];
    if (ch.key !== "continues") {
      fields.push(...bilingual(`${base}.body`, "เนื้อความ", "textarea"));
      fields.push(...bilingual(`${base}.imageAlt`, "คำอธิบายภาพ (alt)"));
    }
    if (ch.key === "philosophy") {
      for (let p = 0; p < 3; p++)
        fields.push(...bilingual(`${base}.pillars.${p}.label`, `ไอคอน ${p + 1} — ข้อความ`));
    }
    if (ch.key === "making") {
      for (let st = 0; st < 5; st++)
        fields.push(...bilingual(`${base}.steps.${st}.label`, `ขั้นตอน ${st + 1}`, "textarea"));
    }
    if (ch.key === "collection") {
      for (let c = 0; c < 4; c++) {
        fields.push(...bilingual(`${base}.palette.${c}.label`, `สี ${c + 1} — ชื่อ`));
        fields.push({ path: `${base}.palette.${c}.swatch`, label: `สี ${c + 1} — ค่าสี`, type: "color" });
      }
      fields.push(...bilingual(`${base}.cta.label`, "ปุ่ม — ข้อความ"));
      fields.push({ path: `${base}.cta.href`, label: "ปุ่ม — ลิงก์" });
    }
    if (ch.key === "continues") {
      fields.push({ path: `${base}.wordmark`, label: "Wordmark" });
      fields.push(...bilingual(`${base}.tagline`, "Tagline"));
      fields.push(...bilingual(`${base}.cta.label`, "ปุ่ม — ข้อความ"));
      fields.push({ path: `${base}.cta.href`, label: "ปุ่ม — ลิงก์" });
    }

    const g: Group = {
      id: ch.key,
      n: ch.n,
      th: ch.th,
      en: ch.en,
      open: ch.i === 0,
      fields,
    };
    if (ch.key !== "continues") {
      const slotMap: Record<string, string> = {
        beginning: "journey-beginning",
        inspiration: "journey-inspiration",
        philosophy: "journey-philosophy",
        making: "journey-making",
        collection: "journey-collection",
      };
      g.image = { slot: slotMap[ch.key], pathForSrc: `${base}.image`, label: "ภาพประกอบบท" };
    }
    return g;
  }),
];

// ---- path helpers -------------------------------------------------
function getPath(obj: any, p: string) {
  return p.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}
function setPath(obj: any, p: string, value: unknown) {
  const parts = p.split(".");
  const root = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur: any = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    cur[k] = Array.isArray(cur[k]) ? [...cur[k]] : { ...cur[k] };
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
  return root;
}

type ImageEdit = { file: File; previewUrl: string };

export default function JourneyAdminEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [images, setImages] = useState<Record<string, ImageEdit>>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const set = useCallback((path: string, value: string) => {
    setData((prev: any) => setPath(prev, path, value));
  }, []);

  const dirtyFields = GROUPS.reduce(
    (n, g) =>
      n +
      g.fields.filter(
        (f) => String(getPath(data, f.path) ?? "") !== String(getPath(initialData, f.path) ?? ""),
      ).length,
    0,
  );
  const dirtyImages = Object.keys(images).length;
  const hasChanges = dirtyFields > 0 || dirtyImages > 0;

  function onFile(slot: string, file: File | null | undefined) {
    if (!file || !file.type.startsWith("image/")) return;
    setImages((prev) => ({ ...prev, [slot]: { file, previewUrl: URL.createObjectURL(file) } }));
  }

  async function save() {
    setSaving(true);
    setError("");
    setStatus("กำลังบันทึก...");
    try {
      const res = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "บันทึกข้อความไม่สำเร็จ");

      for (const [slot, edit] of Object.entries(images)) {
        const form = new FormData();
        form.append("slot", slot);
        form.append("file", edit.file);
        const up = await fetch("/api/upload", { method: "POST", body: form });
        if (!up.ok) throw new Error((await up.json()).error ?? `อัปโหลดรูป ${slot} ไม่สำเร็จ`);
      }

      setImages({});
      setStatus("บันทึกแล้ว ✓ เปิด /journey อีกแท็บแล้วรีเฟรช · อย่าลืม commit + push เพื่อขึ้นเว็บจริง");
    } catch (e: any) {
      setError(e.message ?? "เกิดข้อผิดพลาด");
      setStatus("");
    } finally {
      setSaving(false);
    }
  }

  function resetAll() {
    if (!confirm("ล้างการแก้ไขที่ยังไม่บันทึกทั้งหมด?")) return;
    setData(initialData);
    setImages({});
    setError("");
    setStatus("");
  }

  return (
    <div className="pb-28">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <a
          href="/journey"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-text-light/15 px-3.5 py-2 text-[12px] text-text-light hover:bg-text-light/5"
        >
          เปิด /journey ในแท็บใหม่ ↗
        </a>
        <span className="text-[12px] text-text-muted">
          แก้ที่นี่ = เขียนไฟล์ <code className="text-gold">lib/journey.content.json</code> +
          <code className="text-gold"> public/images/journey/*</code> · ใช้ได้เฉพาะ{" "}
          <code className="text-gold">npm run dev</code> ในเครื่อง
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {GROUPS.map((g) => (
          <details
            key={g.id}
            open={g.open}
            className="overflow-hidden rounded-xl border border-text-light/10 bg-bg-secondary/40"
          >
            <summary className="flex cursor-pointer list-none select-none items-center gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-text-light/15 font-mono text-[10.5px] text-text-muted">
                {g.n}
              </span>
              <span className="font-serif text-[16px] text-text-light">{g.th}</span>
              <span className="font-mono text-[10.5px] text-text-muted">{g.en}</span>
            </summary>

            <div className="flex flex-col gap-4 px-4 pb-5 pt-1">
              {g.image && (
                <ImageDrop
                  label={g.image.label}
                  fileHint={g.image.slot}
                  src={images[g.image.slot]?.previewUrl ?? String(getPath(data, g.image.pathForSrc))}
                  edited={!!images[g.image.slot]}
                  onFile={(f) => onFile(g.image!.slot, f)}
                />
              )}

              <div className="grid grid-cols-2 gap-x-4 gap-y-3 max-[620px]:grid-cols-1">
                {g.fields.map((f) => (
                  <FieldInput
                    key={f.path}
                    field={f}
                    value={String(getPath(data, f.path) ?? "")}
                    dirty={
                      String(getPath(data, f.path) ?? "") !==
                      String(getPath(initialData, f.path) ?? "")
                    }
                    onChange={(v) => set(f.path, v)}
                  />
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-text-light/10 bg-bg-secondary">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-5 py-3">
          <span className="mr-auto text-[12.5px] text-text-muted">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : status ? (
              status
            ) : hasChanges ? (
              <>
                แก้ข้อความ <b className="text-text-light">{dirtyFields}</b> ช่อง · รูปใหม่{" "}
                <b className="text-text-light">{dirtyImages}</b> รูป
              </>
            ) : (
              "ยังไม่มีการแก้ไข"
            )}
          </span>
          <button
            type="button"
            onClick={resetAll}
            disabled={saving || !hasChanges}
            className="rounded-lg border border-red-400/30 px-4 py-2.5 text-[13.5px] font-semibold text-red-400 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            รีเซ็ต
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || !hasChanges}
            className="rounded-lg bg-gold px-5 py-2.5 text-[13.5px] font-semibold text-bg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  dirty,
  onChange,
}: {
  field: Field;
  value: string;
  dirty: boolean;
  onChange: (v: string) => void;
}) {
  const base = `w-full rounded-md border bg-bg px-2.5 py-2 text-[14px] text-text-light transition-colors focus:border-gold focus:outline-none ${
    dirty ? "border-gold/60 bg-gold/5" : "border-text-light/15"
  }`;

  if (field.type === "color") {
    return (
      <label className="flex flex-col gap-1.5">
        <span className="text-[12px] text-text-muted">{field.label}</span>
        <div className={`flex items-center gap-2.5 rounded-md border px-2.5 py-1.5 ${dirty ? "border-gold/60 bg-gold/5" : "border-text-light/15"}`}>
          <input
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-8 shrink-0 cursor-pointer rounded border border-text-light/20 bg-transparent"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent font-mono text-[13px] text-text-light outline-none"
          />
        </div>
      </label>
    );
  }

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] text-text-muted">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={`${base} resize-y`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      )}
    </label>
  );
}

function ImageDrop({
  label,
  fileHint,
  src,
  edited,
  onFile,
}: {
  label: string;
  fileHint: string;
  src: string;
  edited: boolean;
  onFile: (f: File | null | undefined) => void;
}) {
  const [over, setOver] = useState(false);
  const id = `jf-${fileHint}`;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] text-text-muted">{label}</span>
      <div
        onClick={() => document.getElementById(id)?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          setOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          onFile(e.dataTransfer.files?.[0]);
        }}
        className={`group relative h-40 w-full max-w-sm cursor-pointer overflow-hidden rounded-lg border-2 border-dashed bg-bg ${
          over ? "border-gold" : "border-text-light/20"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-md bg-black/70 px-2.5 py-2 text-center text-[11px] leading-tight text-white">
            ลากรูปมาวาง
            <br />
            หรือคลิกเพื่อเลือกไฟล์
          </span>
        </div>
        <input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
      {edited && <code className="text-[11px] text-gold">รูปใหม่ (ยังไม่บันทึก)</code>}
    </div>
  );
}
