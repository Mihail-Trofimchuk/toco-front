import { cookies } from "next/headers";
import AppLayout from "@/components/layout/AppLayout/AppLayout";
import TransactionsPage from "@/components/pages/TransactionsPage";

export default async function Transactions() {
  // Implement
  // useRoleGuard(["client"]);
  const cookieStore = await cookies();
  const raw = cookieStore.get("token")?.value;

  if (!raw) {
    return;
  }

  return (
    <AppLayout>
      <TransactionsPage />
    </AppLayout>
  );
}
