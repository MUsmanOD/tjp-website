import { ContactContent } from "@/components/contact/contact-content";
import { translations } from "@/i18n/messages";

export const metadata = { title: `${translations.en.navigation.contact} | TJP`, description: translations.en.contact.description };

export default function ContactPage() {
  return <main id="main-content" tabIndex={-1} className="contact-page flex-1"><ContactContent /></main>;
}
