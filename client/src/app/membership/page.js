import { MembershipContent } from "@/components/membership/membership-content";
import { translations } from "@/i18n/messages";
import {connection} from 'next/server';

export const metadata = { title: `${translations.en.common.membership} | TJP`, description: translations.en.membership.description };

export default async function MembershipPage() {
  await connection();
  return <main id="main-content" tabIndex={-1} className="flex-1 membership-page"><MembershipContent /></main>;
}
