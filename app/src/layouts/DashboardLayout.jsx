import { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dashboard-layout">
      <Navbar app onMenu={() => setMobileOpen((current) => !current)} />

      {mobileOpen && (
        <button
          type="button"
          className="dashboard-layout__mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed((current) => !current)}
        onNavigate={() => setMobileOpen(false)}
      />

      <main className={`dashboard-layout__content ${collapsed ? "dashboard-layout__content--collapsed" : ""}`}>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
