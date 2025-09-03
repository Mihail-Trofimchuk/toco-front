"use client";

import { ReactNode, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../AppSidebar/AppSidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      if (!res.ok) throw new Error("Logout failed");
    } catch (err) {
      router.push("/auth/login");
      console.error(err);
    }
  };

  const headerTitle = useMemo(() => {
    if (pathname.startsWith("/dashboard/client")) return "Client Dashboard";
    if (pathname.startsWith("/dashboard/participant")) return "Participant Dashboard";
    if (pathname.startsWith("/transactions")) return "Transactions";
    if (pathname.startsWith("/available")) return "Available Resources";
    if (pathname.startsWith("/wallet")) return "Wallet";
    return "Dashboard";
  }, [pathname]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-gray-50 dark:bg-gray-900">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <header className="h-18 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
  
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-lg font-bold">{headerTitle}</h1>
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <User className="w-5 h-5" />
              </Button>
              {/* Implement <ConnectWalletButton /> */}

              {profileOpen && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-700 shadow-lg rounded-lg p-2 w-40 z-50">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center gap-2 text-red-500"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </Button>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}