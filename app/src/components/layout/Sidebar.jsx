import {
  LayoutDashboard, Map, BookOpen, FolderKanban, ChartNoAxesCombined,
  CalendarDays, Sparkles, CircleHelp, Timer, ChevronLeft, ChevronRight,
} from "lucide-react";
import { NavLink, Link } from "react-router";
import mountainsLight from "../../assets/image/mountains_light.png";
import mountainsDark from "../../assets/image/mountains_dark.png";
import "../../style/sidebar.css";

const navigation = [
  {
    section: "Workspace",
    items: [
      { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
      { label: "My Roadmap", path: "/roadmap", icon: Map },
      { label: "Courses", path: "/courses", icon: BookOpen },
      { label: "Projects", path: "/projects", icon: FolderKanban },
      { label: "Progress", path: "/progress", icon: ChartNoAxesCombined },
      { label: "Quizzes", path: "/quizzes", icon: CircleHelp },
      { label: "Calendar", path: "/calendar", icon: CalendarDays },
      { label: "Focus Mode", path: "/focus", icon: Timer },
    ],
  },
  {
    section: "Support",
    items: [{ label: "Ask UrPath AI", path: "/ask-ai", icon: Sparkles }],
  },
];

function Sidebar({ collapsed, mobileOpen, onToggle, onNavigate }) {
  return (
    <aside className={"sidebar " + (collapsed ? "sidebar--collapsed " : "") + (mobileOpen ? "sidebar--mobile-open" : "")}>
      <div className="sidebar__brand">
        <Link to="/dashboard" className="sidebar__brand-link" title={collapsed ? "UrPath" : undefined} onClick={onNavigate}>
          <div className="sidebar__logo"><span>U</span></div>
          {!collapsed && (
            <div className="sidebar__brand-text">
              <span className="sidebar__brand-name">UrPath</span>
              <span className="sidebar__brand-subtitle">Learn. Build. Grow.</span>
            </div>
          )}
        </Link>
      </div>
      <nav className="sidebar__nav" aria-label="Main navigation">
        {navigation.map((group) => (
          <div className="sidebar__group" key={group.section}>
            {!collapsed && <p className="sidebar__section-title">{group.section}</p>}
            <div className="sidebar__items">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    onClick={onNavigate}
                    className={({ isActive }) => "sidebar__item " + (isActive ? "sidebar__item--active" : "")}
                  >
                    <span className="sidebar__item-icon"><Icon size={19} strokeWidth={1.8} /></span>
                    {!collapsed && <span className="sidebar__item-label">{item.label}</span>}
                    {item.label === "Ask UrPath AI" && !collapsed && <span className="sidebar__ai-indicator" />}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="sidebar__mountains" aria-hidden="true">
        <img src={mountainsLight} alt="" className="sidebar__mountain sidebar__mountain--light" />
        <img src={mountainsDark} alt="" className="sidebar__mountain sidebar__mountain--dark" />
      </div>
      <button type="button" className="sidebar__toggle" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
        {collapsed ? <ChevronRight size={16} strokeWidth={2.2} /> : <ChevronLeft size={16} strokeWidth={2.2} />}
      </button>
    </aside>
  );
}
export default Sidebar;
