import React, { useState, Suspense } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Bottombar from "./Bottombar";

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950">
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20"></div>
        <div className="absolute inset-0 rounded-full border-t-2 border-amber-400 animate-spin"></div>
      </div>
      <p className="text-slate-400 text-sm tracking-widest uppercase font-medium">
        Loading
      </p>
    </div>
  </div>
);

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      {/* Sidebar — hidden on mobile, visible on lg+ */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 pb-20 lg:pb-6">
          <Suspense fallback={<PageLoader />}>
            <div className="p-4 md:p-6 lg:p-8 max-w-screen-2xl mx-auto">
              {children}
            </div>
          </Suspense>
        </main>

        {/* Mobile bottom bar */}
        <div className="lg:hidden">
          <Bottombar />
        </div>
      </div>
    </div>
  );
};

export default Layout;
