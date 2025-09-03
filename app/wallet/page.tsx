import AppLayout from "@/components/layout/AppLayout/AppLayout";
import WalletPage from "@/components/pages/WalletPage";
import { cookies } from "next/headers";

export default async function Wallet() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("token")?.value;

  if (!raw) {
    return;
  }

  return (
    <AppLayout>
      <WalletPage token={raw} />
    </AppLayout>
  );
}
