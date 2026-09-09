import {
  LayoutDashboard,
  Map,
  PlusCircle,
  BookOpen,
  FolderKanban,
  ChartNoAxesCombined,
  CalendarDays,
  Sparkles,
 
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { NavLink, Link } from "react-router";



import mountainsLight from "../../assets/image/mountains_light.png";
import mountainsDark from "../../assets/image/mountains_dark.png";

import "../../style/sidebar.css";

const navigation = [
  {
    section: "Workspace",
    items: [
      {
        label: "Overview",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "My Roadmap",
        path: "/roadmap",
        icon: Map,
      },
      {
        label: "Create Roadmap",
        path: "/create-roadmap",
        icon: PlusCircle,
      },
      {
        label: "Courses",
        path: "/courses",
        icon: BookOpen,
      },
      {
        label: "Projects",
        path: "/projects",
        icon: FolderKanban,
      },
      {
        label: "Progress",
        path: "/progress",
        icon: ChartNoAxesCombined,
      },
      {
        label: "Calendar",
        path: "/calendar",
        icon: CalendarDays,
      },
    ],
  },
  {
    section: "AI",
    items: [
      {
        label: "Ask UrPath AI",
        path: "/ask-ai",
        icon: Sparkles,
      },
    ],
  },
];

function Sidebar({ collapsed, onToggle }) {
  

  return (
    <aside
      className={`sidebar ${
        collapsed ? "sidebar--collapsed" : ""
      }`}
    >
      {/* BRAND */}
      <div className="sidebar__brand">
        <Link
          to="/dashboard"
          className="sidebar__brand-link"
          title={collapsed ? "UrPath" : undefined}
        >
          <div className="sidebar__logo">
            <span>U</span>
          </div>

          {!collapsed && (
            <div className="sidebar__brand-text">
              <span className="sidebar__brand-name">
                UrPath
              </span>

              <span className="sidebar__brand-subtitle">
                Learn. Build. Grow.
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar__nav">
        {navigation.map((group) => (
          <div
            className="sidebar__group"
            key={group.section}
          >
            {!collapsed && (
              <p className="sidebar__section-title">
                {group.section}
              </p>
            )}

            <div className="sidebar__items">
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `sidebar__item ${
                        isActive
                          ? "sidebar__item--active"
                          : ""
                      }`
                    }
                  >
                    <span className="sidebar__item-icon">
                      <Icon
                        size={19}
                        strokeWidth={1.8}
                      />
                    </span>

                    {!collapsed && (
                      <span className="sidebar__item-label">
                        {item.label}
                      </span>
                    )}

                    {item.label === "Ask UrPath AI" &&
                      !collapsed && (
                        <span className="sidebar__ai-indicator" />
                      )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      

      {/* MOUNTAINS */}
      <div
        className="sidebar__mountains"
        aria-hidden="true"
      >
        <img
          src={mountainsLight}
          alt=""
          className="sidebar__mountain sidebar__mountain--light"
        />

        <img
          src={mountainsDark}
          alt=""
          className="sidebar__mountain sidebar__mountain--dark"
        />
      </div>

      {/* COLLAPSE BUTTON */}
      <button
        type="button"
        className="sidebar__toggle"
        onClick={onToggle}
        aria-label={
          collapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
      >
        {collapsed ? (
          <ChevronRight
            size={16}
            strokeWidth={2.2}
          />
        ) : (
          <ChevronLeft
            size={16}
            strokeWidth={2.2}
          />
        )}
      </button>
    </aside>
  );
}

export default Sidebar;