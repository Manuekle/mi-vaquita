"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin_auth") === "true";
    
    if (!isAdmin && pathname !== "/admin/login") {
      router.push("/admin/login");
    } else if (isAdmin && pathname === "/admin/login") {
      router.push("/admin");
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2ECE1] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (!authorized && pathname !== "/admin/login") return null;

  return <>{children}</>;
}
