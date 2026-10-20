import { MembershipContent } from "@/components/membership/membership-content";
import { translations } from "@/i18n/messages";

export const metadata = { title: `${translations.en.common.membership} | TJP`, description: translations.en.membership.description };

export default function MembershipPage() {
  return <main id="main-content" tabIndex={-1} className="flex-1 membership-page"><MembershipContent /></main>;
}
