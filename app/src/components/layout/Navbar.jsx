import { Sun, Moon, Bell, Search, UserCircle, Menu } from "lucide-react";
import { Link } from "react-router";
import { useThemeStore } from "../../stores/themeStore";
import "../../style/navbar.css";

function Navbar({ app = false, onMenu }) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <header className={`navbar ${app ? "navbar--app" : "navbar--public"}`}>
      {!app && (
        <nav className="navbar__links">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>
      )}

      <div className="navbar__actions">
        {app && (
          <button type="button" className="navbar__menu" onClick={onMenu} aria-label="Open navigation">
            <Menu size={20} strokeWidth={1.9} />
          </button>
        )}

        {app && (
          <div className="navbar__search">
            <Search size={18} strokeWidth={1.8} />
            <input type="text" placeholder="Search..." />
          </div>
        )}

        {app && (
          <button type="button" className="navbar__icon-button" aria-label="Notifications">
            <Bell size={19} strokeWidth={1.8} />
          </button>
        )}

        <button
          type="button"
          className="navbar__theme"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
        >
          {theme === "dark" ? <Sun size={19} strokeWidth={1.8} /> : <Moon size={19} strokeWidth={1.8} />}
        </button>

        {!app && (
          <>
            <Link to="/login" className="navbar__login">Login</Link>
            <Link to="/register" className="navbar__get-started">Get Started</Link>
          </>
        )}

        {app && (
          <Link to="/profile" className="navbar__profile" aria-label="Profile">
            <UserCircle size={27} strokeWidth={1.6} />
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
