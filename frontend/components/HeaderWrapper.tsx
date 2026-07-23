"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";

export default function HeaderWrapper() {
  const pathname = usePathname();
  
  // Do not render global header on dashboard, admin, profile, and auth routes if desired
  const hiddenRoutes = ["/dashboard", "/admin", "/profile"];
  
  // Check if pathname starts with any of the hidden routes (accounting for locale)
  const isHidden = hiddenRoutes.some(route => 
    pathname.includes(route) || pathname === route
  );

  if (isHidden) return null;

  return <Header />;
}
