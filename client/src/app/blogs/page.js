import { JournalContent } from "@/components/journal/journal-content";
import { translations } from "@/i18n/messages";

export const metadata = { title: `${translations.en.navigation.blogs} | TJP`, description: translations.en.journal.description };

export default function BlogsPage() {
  return <main id="main-content" tabIndex={-1} className="flex-1"><JournalContent /></main>;
}
