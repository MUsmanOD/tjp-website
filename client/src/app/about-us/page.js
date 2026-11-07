import { AboutContent } from "@/components/about/about-content";
import { translations } from "@/i18n/messages";

export const metadata = { title: "About Us | TJP", description: translations.en.aboutPage.intro.description };

export default function AboutPage() {
  return <main id="main-content" tabIndex={-1} className="flex-1"><AboutContent /></main>;
}
