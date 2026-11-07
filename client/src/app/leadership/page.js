import { LeadershipContent } from "@/components/leadership/leadership-content";
import { translations } from "@/i18n/messages";

export const metadata = { title: `${translations.en.navigation.leadership} | TJP`, description: translations.en.leadership.intro.description };

export default function LeadershipPage() {
  return <main id="main-content" tabIndex={-1} className="flex-1"><LeadershipContent /></main>;
}
