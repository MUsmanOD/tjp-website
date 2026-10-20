import { GalleryContent } from "@/components/gallery/gallery-content";
import { translations } from "@/i18n/messages";

export const metadata = { title: `${translations.en.navigation.gallery} | TJP`, description: translations.en.gallery.description };

export default function GalleryPage() {
  return <main id="main-content" tabIndex={-1} className="flex-1"><GalleryContent /></main>;
}
