"use client";

import { useEffect } from "react";
import SideNav from "@/app/ui/dashboard/Sidenav";
import { useAuthContext } from "@/lib/AuthContextProvider";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);
  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
