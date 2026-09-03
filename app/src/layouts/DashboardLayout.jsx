import { Outlet } from "react-router";
import {useState} from "react";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="dashboard-layout">
      <Navbar app />

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((current) => !current)}
      />

      <main
        className={`dashboard-layout__content ${
          collapsed ? "dashboard-layout__content--collapsed" : ""
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;