import { Suspense } from "react";
import { connection } from "next/server";
import { AdminWorkspace } from "@/components/admin/workspace";
import { LogoLoading } from "@/components/providers/website-loading";

export default async function PortalDashboardPage() {
  await connection();
  return <Suspense fallback={<LogoLoading />}><AdminWorkspace /></Suspense>;
}
