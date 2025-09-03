import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Activities from "@/components/pages/ActivityPage";
import AppLayout from "@/components/layout/AppLayout/AppLayout";

export default async function ParticipantDashboard() {
  // useRoleGuard(["participant"]);

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
