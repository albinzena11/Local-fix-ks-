"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  
  const hiddenRoutes = ["/dashboard", "/admin", "/profile"];
  
  const isHidden = hiddenRoutes.some(route => 
    pathname.includes(route) || pathname === route
  );

  if (isHidden) return null;

  return <Footer />;
}
