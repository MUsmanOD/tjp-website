import { AuthContent } from "@/components/auth/auth-content";
import { translations } from "@/i18n/messages";

export const metadata = { title: `${translations.en.common.signup} | TJP`, robots: { index: false } };

export default function SignupPage() {
  return <main id="main-content" tabIndex={-1} className="auth-page"><AuthContent signup /></main>;
}
