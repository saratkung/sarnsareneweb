import AdminEditor from "@/components/AdminEditor";
import * as content from "@/lib/content";

export default function AdminPage() {
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

  return <AdminEditor initialData={initialData} />;
}
