import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import AvailablePage from "@/components/pages/AvailablePage";
import AppLayout from "@/components/layout/AppLayout/AppLayout";

export default async function Page() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("token")?.value;

  if (!raw) {
    return;
  }

  const token = raw?.startsWith("Bearer ") ? raw.slice(7) : raw;
  const decoded = jwt.decode(token) as { role: string };

  return (
    <AppLayout>
      <AvailablePage token={raw} role={decoded.role} />;
    </AppLayout>
  );
}
