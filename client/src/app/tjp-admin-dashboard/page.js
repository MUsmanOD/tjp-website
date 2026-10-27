import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata = { title: "Admin dashboard | TJP", robots: { index: false, follow: false } };

export default function AdminDashboardPage() {
  return <main id="main-content" tabIndex={-1} className="admin-dashboard-page"><AdminDashboard /></main>;
}
