import { announcement } from "@/lib/content";

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-bg text-text-light">
      <div className="max-w-content mx-auto px-6 md:px-10 py-2.5 text-center">
        <p className="text-[10px] md:text-[11px] tracking-widest2 uppercase font-sans font-medium">
          {announcement.message}
        </p>
      </div>
    </div>
  );
}
