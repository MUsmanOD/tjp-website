import { AdminLogin } from "@/components/admin/admin-login";

export const metadata = { title: "Admin login | TJP", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return <main id="main-content" tabIndex={-1} className="admin-login-page"><AdminLogin /></main>;
}
