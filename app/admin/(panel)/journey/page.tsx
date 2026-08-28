import JourneyAdminEditor from "@/components/JourneyAdminEditor";
import journeyContent from "@/lib/journey.content.json";

// Editor for the standalone /journey brand-film page. Writes
// lib/journey.content.json + public/images/journey/* — dev only, then
// commit + redeploy to publish (same model as /admin/site).
export const metadata = { title: "Journey Page — SARNSARENE Admin" };

export default function AdminJourneyPage() {
  const isProd = process.env.NODE_ENV === "production";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 font-serif text-2xl text-text-light">Journey Page</h1>
      <p className="mb-8 text-[12px] text-text-muted">
        แก้ข้อความ สี และรูปของหน้า <code className="text-gold">/journey</code> —
        เขียนลงไฟล์ต้นทาง แล้ว commit + redeploy เพื่อขึ้นเว็บจริง
      </p>

      {isProd ? (
        <div className="rounded-xl border border-text-light/10 bg-bg-secondary/40 p-6 text-[13px] text-text-muted">
          การแก้ไขปิดอยู่บน production — รันในเครื่องด้วย{" "}
          <code className="text-gold">npm run dev</code> เพื่อแก้ แล้ว push
        </div>
      ) : (
        <JourneyAdminEditor initialData={journeyContent} />
      )}
    </div>
  );
}
