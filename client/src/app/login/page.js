import { LoginContent } from "@/components/auth/login-content";

export const metadata = { title: "Login | TJP", robots: { index: false } };

export default function LoginPage() {
  return <main id="main-content" tabIndex={-1} className="auth-page"><LoginContent /></main>;
}
