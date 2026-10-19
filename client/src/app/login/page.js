import { LoginContent } from "@/components/auth/login-content";

export const metadata = { title: "Login | TJP", robots: { index: false } };

export default function LoginPage() {
  return <main id="main-content" tabIndex={-1} className="flex flex-1 items-center bg-surface"><LoginContent /></main>;
}
