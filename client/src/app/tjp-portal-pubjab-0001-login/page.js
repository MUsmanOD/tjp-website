import { connection } from "next/server";
import { AdminSignIn } from "@/components/admin/sign-in";

export default async function PortalSignInPage() {
  await connection();
  return <AdminSignIn />;
}
