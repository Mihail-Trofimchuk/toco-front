import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import AppLayout from "@/components/layout/AppLayout/AppLayout";
import Activities from "@/components/pages/ActivityPage";

export default async function ClientDashboard() {
  // Implement
  // useRoleGuard(["client"]);
  const cookieStore = await cookies();
  const raw = cookieStore.get("token")?.value;

  if (!raw) {
    return;
  }

  const token = raw?.startsWith("Bearer ") ? raw.slice(7) : raw;
  const decoded = jwt.decode(token) as { role: string };

  return (
    <AppLayout>
      <Activities token={raw} role={decoded.role} />
    </AppLayout>
  );
}
