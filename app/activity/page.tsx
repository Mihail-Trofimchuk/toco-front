
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Activities from "@/components/pages/ActivityPage";

export default async function Page() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("token")?.value;

  if(!raw) {
    return;
  }

  const token = raw?.startsWith("Bearer ") ? raw.slice(7) : raw;
  const decoded = jwt.decode(token) as { role: string}

  return <Activities token={raw} role={decoded.role}/>;
}

