import { Sun, Moon, Bell, UserCircle, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getProfile } from "../../services/profileService";
import { useThemeStore } from "../../stores/themeStore";
import "../../style/navbar.css";

function Navbar({ app = false, auth = false, onMenu }) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileName, setProfileName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!app) return;
    let mounted = true;
    const syncProfile = (event) => {
      const user = event.detail;
      if (!mounted || !user) return;
      setProfilePhoto(user.profilePhoto || "");
      setProfileName(user.name || "");
    };
    getProfile().then((response) => {
      if (!mounted) return;
      const user = response?.user || response?.data?.user;
      if (user) {
        setProfilePhoto(user.profilePhoto || "");
        setProfileName(user.name || "");
      }
    }).catch(() => {});
    window.addEventListener("urpath:profile-updated", syncProfile);
    return () => {
      mounted = false;
      window.removeEventListener("urpath:profile-updated", syncProfile);
    };
  }, [app]);

  return (
    <header className={`navbar ${app ? "navbar--app" : auth ? "navbar--auth" : "navbar--public"}`}>
      {app && (
        <div className="navbar__mobile-brand">
          <button type="button" className="navbar__menu" onClick={onMenu} aria-label="Open navigation">
            <Menu size={20} strokeWidth={1.9} />
          </button>
          <Link to="/dashboard" className="navbar__mobile-logo" aria-label="UrPath home"><span>U</span></Link>
          <span className="navbar__mobile-name">UrPath</span>
        </div>
      )}
      {!app && (
        <>
          <Link to="/" className="navbar__brand" aria-label="UrPath home">
            <span className="navbar__brand-word">Ur<span>Path</span></span>
          </Link>
          <nav className={`navbar__links ${mobileOpen ? "is-open" : ""}`}>
            <a href="#why-urpath" onClick={() => setMobileOpen(false)}>Why UrPath</a>
            <a href="#explore" onClick={() => setMobileOpen(false)}>Explore skills</a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)}>How it works</a>
            <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
          </nav>
        </>
      )}

        {!app && !auth && (
          <button
            type="button"
            className="navbar__public-menu"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

      <div className="navbar__actions">
        {app && (
          <Link to="/notifications" className="navbar__icon-button" aria-label="Notifications">
            <Bell size={19} strokeWidth={1.8} />
          </Link>
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
            <Link to="/register" className="navbar__get-started">Register</Link>
          </>
        )}

        {app && (
          <Link to="/profile" className={`navbar__profile ${profilePhoto ? "navbar__profile--photo" : ""}`} aria-label={profileName ? `Profile: ${profileName}` : "Profile"}>
            {profilePhoto ? <img src={profilePhoto} alt="" /> : <UserCircle size={27} strokeWidth={1.6} />}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
