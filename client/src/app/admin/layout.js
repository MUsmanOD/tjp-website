import { AdminThemeProvider } from "@/components/admin/theme-select";
export default function AdminLayout({ children }) {
  return <AdminThemeProvider>{children}</AdminThemeProvider>;
}
