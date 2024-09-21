

import { useRouter } from "next/navigation";
import Navbardark from "@/components/ui/navbarblack";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}



const Layout: React.FC<LayoutProps> = ({ children }) => {
 
  return (
    <div>
      <main>
        <Navbardark color="gray-900" textcolor="white" />
        {children}
      </main>
    </div>
  );
};

export default Layout;
