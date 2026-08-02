"use client";

import { useState, useRef, useCallback } from "react";

// ------------------------------------------------------------------
// Config: every editable text field and image slot on the landing
// page, in the same top-to-bottom order as app/page.tsx.
// ------------------------------------------------------------------

type FieldConfig = { path: string; label: string; type?: "text" | "textarea" };
type ImageSlotConfig = { slot: string; fileName: string; readonly?: boolean; note?: string };
type SectionConfig = {
  id: string;
  n: string;
  th: string;
  en: string;
  defaultOpen?: boolean;
  images?: ImageSlotConfig[];
  fields: FieldConfig[];
};

const SECTIONS: SectionConfig[] = [
  {
    id: "announcement", n: "01", th: "แถบประกาศ", en: "Announcement Bar",
    fields: [{ path: "announcement.message", label: "ข้อความประกาศ", type: "textarea" }],
  },
  {
    id: "hero", n: "02", th: "ภาพหลักหน้าแรก", en: "Hero", defaultOpen: true,
    images: [{ slot: "hero", fileName: "hero.jpg" }],
    fields: [
      { path: "hero.eyebrow", label: "ข้อความเล็กเหนือหัวข้อ" },
      { path: "hero.title", label: "หัวข้อใหญ่" },
      { path: "hero.subtitle", label: "คำโปรย", type: "textarea" },
      { path: "hero.ctaPrimary.label", label: "ปุ่มที่ 1" },
      { path: "hero.ctaSecondary.label", label: "ปุ่มที่ 2" },
    ],
  },
  {
    id: "philosophy", n: "03", th: "ปรัชญาแบรนด์", en: "Philosophy",
    fields: [
      { path: "philosophy.eyebrow", label: "ข้อความเล็กเหนือหัวข้อ" },
      { path: "philosophy.title", label: "หัวข้อ" },
      { path: "philosophy.items.0.title", label: "การ์ด 1 — หัวข้อ" },
      { path: "philosophy.items.0.description", label: "การ์ด 1 — คำอธิบาย", type: "textarea" },
      { path: "philosophy.items.1.title", label: "การ์ด 2 — หัวข้อ" },
      { path: "philosophy.items.1.description", label: "การ์ด 2 — คำอธิบาย", type: "textarea" },
      { path: "philosophy.items.2.title", label: "การ์ด 3 — หัวข้อ" },
      { path: "philosophy.items.2.description", label: "การ์ด 3 — คำอธิบาย", type: "textarea" },
      { path: "philosophy.items.3.title", label: "การ์ด 4 — หัวข้อ" },
      { path: "philosophy.items.3.description", label: "การ์ด 4 — คำอธิบาย", type: "textarea" },
    ],
  },
  {
    id: "ourStory", n: "04", th: "เรื่องราวแบรนด์", en: "Our Story", defaultOpen: true,
    images: [{ slot: "story", fileName: "story.jpg" }],
    fields: [
      { path: "ourStory.eyebrow", label: "ข้อความเล็กเหนือหัวข้อ" },
      { path: "ourStory.title", label: "หัวข้อ" },
      { path: "ourStory.paragraphs.0", label: "ย่อหน้า 1", type: "textarea" },
      { path: "ourStory.paragraphs.1", label: "ย่อหน้า 2", type: "textarea" },
      { path: "ourStory.paragraphs.2", label: "ย่อหน้า 3", type: "textarea" },
    ],
  },
  {
    id: "eastern", n: "05", th: "แรงบันดาลใจตะวันออก", en: "Eastern Inspiration", defaultOpen: true,
    images: [
      { slot: "eastern-1", fileName: "eastern-1.jpg" },
      { slot: "eastern-2", fileName: "eastern-2.jpg" },
    ],
    fields: [
      { path: "easternInspiration.eyebrow", label: "ข้อความเล็กเหนือหัวข้อ" },
      { path: "easternInspiration.title", label: "หัวข้อ" },
      { path: "easternInspiration.sections.0.title", label: "บล็อก 1 — หัวข้อ" },
      { path: "easternInspiration.sections.0.description", label: "บล็อก 1 — คำอธิบาย", type: "textarea" },
      { path: "easternInspiration.sections.1.title", label: "บล็อก 2 — หัวข้อ" },
      { path: "easternInspiration.sections.1.description", label: "บล็อก 2 — คำอธิบาย", type: "textarea" },
    ],
  },
  {
    id: "signature", n: "06", th: "ประสบการณ์ซิกเนเจอร์", en: "Signature Experience",
    fields: [
      { path: "signatureExperience.eyebrow", label: "ข้อความเล็กเหนือหัวข้อ" },
      { path: "signatureExperience.title", label: "หัวข้อ" },
      { path: "signatureExperience.cards.0.title", label: "การ์ด 1 — หัวข้อ" },
      { path: "signatureExperience.cards.0.description", label: "การ์ด 1 — คำอธิบาย", type: "textarea" },
      { path: "signatureExperience.cards.1.title", label: "การ์ด 2 — หัวข้อ" },
      { path: "signatureExperience.cards.1.description", label: "การ์ด 2 — คำอธิบาย", type: "textarea" },
      { path: "signatureExperience.cards.2.title", label: "การ์ด 3 — หัวข้อ" },
      { path: "signatureExperience.cards.2.description", label: "การ์ด 3 — คำอธิบาย", type: "textarea" },
    ],
  },
  {
    id: "quote", n: "07", th: "คำคมไฮไลต์", en: "Highlight Quote",
    fields: [
      { path: "highlightQuote.quote", label: "คำคม", type: "textarea" },
      { path: "highlightQuote.attribution", label: "ชื่อผู้กล่าว" },
    ],
  },
  {
    id: "manifesto", n: "08", th: "แถลงการณ์แบรนด์", en: "Brand Manifesto",
    fields: [
      { path: "brandManifesto.eyebrow", label: "ข้อความเล็กเหนือหัวข้อ" },
      { path: "brandManifesto.title", label: "หัวข้อ" },
      { path: "brandManifesto.paragraphs.0", label: "ย่อหน้า 1", type: "textarea" },
      { path: "brandManifesto.paragraphs.1", label: "ย่อหน้า 2", type: "textarea" },
      { path: "brandManifesto.paragraphs.2", label: "ย่อหน้า 3", type: "textarea" },
    ],
  },
  {
    id: "collection", n: "09", th: "คอลเลกชันสินค้า", en: "Featured Collection", defaultOpen: true,
    images: [
      { slot: "product-1", fileName: "product-1.jpg" },
      { slot: "product-2", fileName: "product-2.jpg" },
      { slot: "product-3", fileName: "product-3.jpg" },
      { slot: "product-4", fileName: "product-4.jpg" },
      { slot: "product-5-grey", fileName: "product-5-grey.jpg" },
    ],
    fields: [
      { path: "featuredCollection.eyebrow", label: "ข้อความเล็กเหนือหัวข้อ" },
      { path: "featuredCollection.title", label: "หัวข้อ" },
      { path: "featuredCollection.viewAll", label: 'ปุ่ม "ดูทั้งหมด"' },
      { path: "featuredCollection.products.0.name", label: "สี 1 — ชื่อ" },
      { path: "featuredCollection.products.0.description", label: "สี 1 — คำอธิบาย", type: "textarea" },
      { path: "featuredCollection.products.0.detail", label: "สี 1 — รายละเอียด" },
      { path: "featuredCollection.products.1.name", label: "สี 2 — ชื่อ" },
      { path: "featuredCollection.products.1.description", label: "สี 2 — คำอธิบาย", type: "textarea" },
      { path: "featuredCollection.products.1.detail", label: "สี 2 — รายละเอียด" },
      { path: "featuredCollection.products.2.name", label: "สี 3 — ชื่อ" },
      { path: "featuredCollection.products.2.description", label: "สี 3 — คำอธิบาย", type: "textarea" },
      { path: "featuredCollection.products.2.detail", label: "สี 3 — รายละเอียด" },
      { path: "featuredCollection.products.3.name", label: "สี 4 — ชื่อ" },
      { path: "featuredCollection.products.3.description", label: "สี 4 — คำอธิบาย", type: "textarea" },
      { path: "featuredCollection.products.3.detail", label: "สี 4 — รายละเอียด" },
      { path: "featuredCollection.products.4.name", label: "สี 5 — ชื่อ" },
      { path: "featuredCollection.products.4.description", label: "สี 5 — คำอธิบาย", type: "textarea" },
      { path: "featuredCollection.products.4.detail", label: "สี 5 — รายละเอียด" },
    ],
  },
  {
    id: "journey", n: "10", th: "ก้าวต่อไป", en: "Journey Forward",
    images: [{ slot: "journey", fileName: "journey.jpg" }],
    fields: [
      { path: "journeyForward.eyebrow", label: "ข้อความเล็กเหนือหัวข้อ" },
      { path: "journeyForward.title", label: "หัวข้อ" },
      { path: "journeyForward.description", label: "คำอธิบาย", type: "textarea" },
    ],
  },
  {
    id: "services", n: "11", th: "บริการเสริมฟรี", en: "Complimentary Services",
    fields: [
      { path: "complimentaryServices.items.0.label", label: "ไอคอน 1 — ข้อความ" },
      { path: "complimentaryServices.items.1.label", label: "ไอคอน 2 — ข้อความ" },
      { path: "complimentaryServices.items.2.label", label: "ไอคอน 3 — ข้อความ" },
      { path: "complimentaryServices.items.3.label", label: "ไอคอน 4 — ข้อความ" },
    ],
  },
  {
    id: "sustainability", n: "12", th: "ความยั่งยืน", en: "Sustainability",
    images: [{ slot: "sustainability", fileName: "sustainability.jpg" }],
    fields: [
      { path: "sustainability.eyebrow", label: "ข้อความเล็กเหนือหัวข้อ" },
      { path: "sustainability.title", label: "หัวข้อ" },
      { path: "sustainability.description", label: "คำอธิบาย", type: "textarea" },
      { path: "sustainability.bullets.0", label: "หัวข้อย่อย 1" },
      { path: "sustainability.bullets.1", label: "หัวข้อย่อย 2" },
      { path: "sustainability.bullets.2", label: "หัวข้อย่อย 3" },
      { path: "sustainability.bullets.3", label: "หัวข้อย่อย 4" },
      { path: "sustainability.cta.label", label: "ปุ่ม" },
    ],
  },
  {
    id: "newsletter", n: "13", th: "สมัครรับข่าวสาร", en: "Newsletter",
    fields: [
      { path: "newsletter.title", label: "หัวข้อ" },
      { path: "newsletter.subtitle", label: "คำโปรย", type: "textarea" },
      { path: "newsletter.placeholder", label: "ข้อความในช่องกรอก" },
      { path: "newsletter.button", label: "ปุ่ม" },
    ],
  },
  {
    id: "footer", n: "14", th: "ท้ายเว็บ", en: "Footer",
    fields: [
      { path: "footer.tagline", label: "แท็กไลน์ (ขึ้นบรรทัดใหม่ได้)", type: "textarea" },
      { path: "footer.columns.0.title", label: "คอลัมน์ 1 — หัวข้อ" },
      { path: "footer.columns.0.items.0", label: "คอลัมน์ 1 — ลิงก์ 1" },
      { path: "footer.columns.0.items.1", label: "คอลัมน์ 1 — ลิงก์ 2" },
      { path: "footer.columns.0.items.2", label: "คอลัมน์ 1 — ลิงก์ 3" },
      { path: "footer.columns.0.items.3", label: "คอลัมน์ 1 — ลิงก์ 4" },
      { path: "footer.columns.1.title", label: "คอลัมน์ 2 — หัวข้อ" },
      { path: "footer.columns.1.items.0", label: "คอลัมน์ 2 — ลิงก์ 1" },
      { path: "footer.columns.1.items.1", label: "คอลัมน์ 2 — ลิงก์ 2" },
      { path: "footer.columns.1.items.2", label: "คอลัมน์ 2 — ลิงก์ 3" },
      { path: "footer.columns.1.items.3", label: "คอลัมน์ 2 — ลิงก์ 4" },
      { path: "footer.columns.2.title", label: "คอลัมน์ 3 — หัวข้อ" },
      { path: "footer.columns.2.items.0", label: "คอลัมน์ 3 — ลิงก์ 1" },
      { path: "footer.columns.2.items.1", label: "คอลัมน์ 3 — ลิงก์ 2" },
      { path: "footer.columns.2.items.2", label: "คอลัมน์ 3 — ลิงก์ 3" },
      { path: "footer.columns.2.items.3", label: "คอลัมน์ 3 — ลิงก์ 4" },
      { path: "footer.columns.3.title", label: "คอลัมน์ 4 — หัวข้อ" },
      { path: "footer.columns.3.items.0", label: "คอลัมน์ 4 — ลิงก์ 1" },
      { path: "footer.columns.3.items.1", label: "คอลัมน์ 4 — ลิงก์ 2" },
      { path: "footer.columns.3.items.2", label: "คอลัมน์ 4 — ลิงก์ 3" },
      { path: "footer.columns.3.items.3", label: "คอลัมน์ 4 — ลิงก์ 4" },
      { path: "footer.copyright", label: "ข้อความลิขสิทธิ์" },
      { path: "footer.legal", label: "ข้อความกฎหมาย" },
    ],
  },
];

// ------------------------------------------------------------------
// Path helpers — read/write a nested object via "a.b.0.c" strings.
// ------------------------------------------------------------------

function getPath(obj: any, pathStr: string) {
  return pathStr.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
}

function setPathImmutable(obj: any, pathStr: string, value: unknown) {
  const parts = pathStr.split(".");
  const root = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur: any = root;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    const next = cur[k];
    cur[k] = Array.isArray(next) ? [...next] : { ...next };
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
  return root;
}

type ImageEdit = { file: File; previewUrl: string };

export default function AdminEditor({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);
  const [images, setImages] = useState<Record<string, ImageEdit>>({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const setField = useCallback((path: string, value: string) => {
    setData((prev: any) => setPathImmutable(prev, path, value));
  }, []);

  const dirtyFieldCount = SECTIONS.reduce((count, section) => {
    return (
      count +
      section.fields.filter((f) => String(getPath(data, f.path) ?? "") !== String(getPath(initialData, f.path) ?? "")).length
    );
  }, 0);
  const dirtyImageCount = Object.keys(images).length;
  const hasChanges = dirtyFieldCount > 0 || dirtyImageCount > 0;

  function handleFile(slot: string, file: File | undefined | null) {
    if (!file || !file.type.startsWith("image/")) return;
    const previewUrl = URL.createObjectURL(file);
    setImages((prev) => ({ ...prev, [slot]: { file, previewUrl } }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setStatus("กำลังบันทึก...");
    try {
      const contentRes = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!contentRes.ok) throw new Error((await contentRes.json()).error ?? "บันทึกข้อความไม่สำเร็จ");

      for (const [slot, edit] of Object.entries(images)) {
        const form = new FormData();
        form.append("slot", slot);
        form.append("file", edit.file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) throw new Error((await res.json()).error ?? `อัปโหลดรูป ${slot} ไม่สำเร็จ`);
      }

      setImages({});
      setStatus("บันทึกแล้ว ✓ เปิดเว็บอีกแท็บแล้วรีเฟรชเพื่อดูผล");
    } catch (e: any) {
      setError(e.message ?? "เกิดข้อผิดพลาด");
      setStatus("");
    } finally {
      setSaving(false);
    }
  }

  function handleResetAll() {
    if (!confirm("ล้างการแก้ไขทั้งหมดที่ยังไม่ได้บันทึกหรือไม่?")) return;
    setData(initialData);
    setImages({});
    setError("");
    setStatus("");
  }

  return (
    <div className="min-h-screen bg-bg text-text-light font-sans pb-28">
      <header className="max-w-[900px] mx-auto px-5 pt-14 pb-7">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.08em] uppercase text-gold bg-gold/10 px-2.5 py-1 rounded">
            SARNSARENE — Admin
          </span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-bg bg-gold px-3.5 py-2 rounded-lg hover:brightness-110"
          >
            เปิดเว็บในแท็บใหม่ ↗
          </a>
        </div>
        <h1 className="font-serif text-[clamp(26px,4vw,36px)] font-semibold mt-4 text-text-light">
          แก้เว็บของคุณได้จากหน้านี้เลย
        </h1>
        <p className="text-text-muted text-[15px] mt-3 max-w-[62ch]">
          แก้ข้อความหรือลากรูปใหม่มาวางทับ แล้วกด "บันทึก" ด้านล่าง — ระบบจะเขียนไฟล์จริงของเว็บให้ทันที
          (ใช้ได้เฉพาะตอนรัน <code className="font-mono text-gold">npm run dev</code> ในเครื่องเท่านั้น)
        </p>
      </header>

      <div className="max-w-[900px] mx-auto px-5 flex flex-col gap-3">
        {SECTIONS.map((section) => (
          <details
            key={section.id}
            open={section.defaultOpen}
            className="bg-bg-secondary border border-beige/10 rounded-xl overflow-hidden"
          >
            <summary className="list-none cursor-pointer select-none px-4 py-3.5 flex items-center gap-3 [&::-webkit-details-marker]:hidden">
              <span className="w-7 h-7 rounded-full bg-bg border border-beige/20 flex items-center justify-center font-mono text-[10.5px] text-text-muted flex-shrink-0">
                {section.n}
              </span>
              <span className="font-serif text-[16px] font-semibold text-text-light">{section.th}</span>
              <span className="font-mono text-[10.5px] text-text-muted">{section.en}</span>
              <span className="ml-auto text-text-muted text-[11px] transition-transform details-chevron">▾</span>
            </summary>

            <div className="px-4 pb-5 pt-1 flex flex-col gap-4">
              {section.images && (
                <div className="flex gap-3.5 flex-wrap">
                  {section.images.map((img) => (
                    <ImageSlot
                      key={img.slot + img.fileName}
                      config={img}
                      edited={images[img.slot]}
                      onFile={(file) => handleFile(img.slot, file)}
                      inputRef={(el) => {
                        fileInputs.current[img.slot] = el;
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 max-[620px]:grid-cols-1 gap-x-4 gap-y-3">
                {section.fields.map((f) => (
                  <Field key={f.path} field={f} data={data} initialData={initialData} onChange={setField} />
                ))}
              </div>
            </div>
          </details>
        ))}
      </div>

      <div className="fixed left-0 right-0 bottom-0 z-20 bg-bg-secondary border-t border-beige/10">
        <div className="max-w-[900px] mx-auto px-5 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-[12.5px] text-text-muted mr-auto">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : status ? (
              status
            ) : hasChanges ? (
              <>
                แก้ข้อความแล้ว <b className="text-text-light">{dirtyFieldCount}</b> ช่อง · รูปใหม่{" "}
                <b className="text-text-light">{dirtyImageCount}</b> รูป
              </>
            ) : (
              "ยังไม่มีการแก้ไข"
            )}
          </span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13.5px] font-semibold px-4 py-2.5 rounded-lg border border-beige/20 text-text-light hover:bg-beige/10"
          >
            เปิดเว็บ ↗
          </a>
          <button
            type="button"
            onClick={handleResetAll}
            disabled={saving || !hasChanges}
            className="text-[13.5px] font-semibold px-4 py-2.5 rounded-lg border border-red-400/30 text-red-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-400/10"
          >
            รีเซ็ต
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="text-[13.5px] font-semibold px-5 py-2.5 rounded-lg bg-gold text-bg disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกลงเว็บ"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  field,
  data,
  initialData,
  onChange,
}: {
  field: FieldConfig;
  data: any;
  initialData: any;
  onChange: (path: string, value: string) => void;
}) {
  const value = String(getPath(data, field.path) ?? "");
  const isDirty = value !== String(getPath(initialData, field.path) ?? "");
  const baseClass = `font-inherit text-[14px] text-text-light bg-bg border rounded-md px-2.5 py-2 resize-y transition-colors focus:outline-none focus:border-gold ${
    isDirty ? "border-gold/60 bg-gold/5" : "border-beige/15"
  }`;

  return (
    <label className="flex flex-col gap-1.5 text-[13px]" htmlFor={field.path}>
      <span className="text-text-muted text-[12px]">{field.label}</span>
      {field.type === "textarea" ? (
        <textarea
          id={field.path}
          rows={3}
          value={value}
          onChange={(e) => onChange(field.path, e.target.value)}
          className={baseClass}
        />
      ) : (
        <input
          id={field.path}
          type="text"
          value={value}
          onChange={(e) => onChange(field.path, e.target.value)}
          className={baseClass}
        />
      )}
    </label>
  );
}

function ImageSlot({
  config,
  edited,
  onFile,
  inputRef,
}: {
  config: ImageSlotConfig;
  edited?: ImageEdit;
  onFile: (file: File | undefined | null) => void;
  inputRef: (el: HTMLInputElement | null) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const src = edited?.previewUrl ?? `/images/${config.fileName}`;

  if (config.readonly) {
    return (
      <div className="w-[150px] flex flex-col gap-1.5">
        <div className="w-[150px] h-[150px] rounded-lg overflow-hidden bg-bg border border-beige/15 opacity-70">
          <img src={src} alt={config.fileName} className="w-full h-full object-cover" />
        </div>
        <code className="text-[11px] text-text-muted">{config.fileName}</code>
        {config.note && <span className="text-[10.5px] text-text-muted leading-[1.4]">{config.note}</span>}
      </div>
    );
  }

  return (
    <div className="w-[150px] flex flex-col gap-1.5">
      <div
        className={`relative w-[150px] h-[150px] rounded-lg overflow-hidden bg-bg border-2 border-dashed cursor-pointer group ${
          dragOver ? "border-gold" : "border-beige/25"
        }`}
        onClick={() => document.getElementById(`file-${config.slot}`)?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onFile(e.dataTransfer.files?.[0]);
        }}
      >
        <img src={src} alt={config.fileName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center text-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
          <span className="bg-black/70 text-white text-[11px] px-2.5 py-2 rounded-md leading-[1.35]">
            ลากรูปมาวาง
            <br />
            หรือคลิกเพื่อเลือกไฟล์
          </span>
        </div>
        <input
          id={`file-${config.slot}`}
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onFile(e.target.files?.[0])}
        />
      </div>
      <code className={`text-[11px] ${edited ? "text-gold" : "text-text-muted"}`}>{config.fileName}</code>
    </div>
  );
}
