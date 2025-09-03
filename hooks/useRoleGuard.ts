"use client";

import { useRouter } from "next/navigation";

export const useRoleGuard = (allowedRoles: string[]) => {
  const router = useRouter();


  // Need to implement
  // useEffect(() => {
  //   const token = document.cookie
  //     .split("; ")

  //   if (!token) {
  //     router.push("/auth/login");
  //     return;
  //   }

  //   const payload = JSON.parse(atob(token.split(".")[1]));
  //   if (!allowedRoles.includes(payload.role)) {
  //     router.push("/auth/login");
  //   }
  // }, [router]);
};
