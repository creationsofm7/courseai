import Navbardark from "@/components/ui/navbarblack";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <main>
        <Navbardark color="gray-900" textcolor="white" />
        {children}
      </main>
    </div>
  );
}