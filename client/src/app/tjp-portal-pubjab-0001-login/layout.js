import { AdminThemeProvider } from "@/components/admin/theme-select";

export const metadata = {
  title: "TJP Admin",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }) {
  return <AdminThemeProvider>{children}</AdminThemeProvider>;
}
