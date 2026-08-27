import AdminEditor from "@/components/AdminEditor";
import * as content from "@/lib/content";
import { theme } from "@/lib/theme";

// The original landing-page content/theme editor. Moved here from
// /admin (which is now the commerce dashboard) — the editor and its
// API routes (/api/content, /api/theme, /api/upload) are unchanged.
export const metadata = { title: "Site Content — SARNSARENE Admin" };

export default function AdminSitePage() {
  const {
    brand,
    announcement,
    nav,
    hero,
    philosophy,
    ourStory,
    easternInspiration,
    signatureExperience,
    highlightQuote,
    brandManifesto,
    featuredCollection,
    journeyForward,
    complimentaryServices,
    sustainability,
    newsletter,
    footer,
  } = content;

  const initialData = {
    brand,
    announcement,
    nav,
    hero,
    philosophy,
    ourStory,
    easternInspiration,
    signatureExperience,
    highlightQuote,
    brandManifesto,
    featuredCollection,
    journeyForward,
    complimentaryServices,
    sustainability,
    newsletter,
    footer,
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 font-serif text-2xl text-text-light">Site Content</h1>
      <p className="mb-8 text-[12px] text-text-muted">
        Edit the landing page copy, colours and images. Changes write to the source
        files and are disabled in production.
      </p>
      <AdminEditor initialData={initialData} initialTheme={theme} />
    </div>
  );
}
