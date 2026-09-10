import { useState } from "react";

import { SideBar } from "../HomeComponents/SideBar";
import { Chat } from "../HomeComponents/Chat";
import { Artifacts } from "../HomeComponents/Artifacts";
import { BillingPanel } from "../HomeComponents/BillingPanel";

export const Home = () => {
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isArtifactsMobileOpen, setIsArtifactsMobileOpen] = useState(false);
 
  const toggleBilling = () => {
    setIsBillingOpen((prev) => !prev);
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <SideBar
        onToggleBilling={toggleBilling}
        isMobileOpen={isSidebarMobileOpen}
        setIsMobileOpen={setIsSidebarMobileOpen}
      />

      {/* Main Chat View */}
      <Chat
        onOpenSidebar={() => setIsSidebarMobileOpen(true)}
        onOpenArtifacts={() => setIsArtifactsMobileOpen(true)}
      />

      {/* Artifacts Panel */}
      <Artifacts
        isMobileOpen={isArtifactsMobileOpen}
        setIsMobileOpen={setIsArtifactsMobileOpen}
      />

      {/* Billing Panel */}
      <BillingPanel
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
      />
    </div>
  );
};

export default Home;