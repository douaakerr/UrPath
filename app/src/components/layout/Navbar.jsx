import { useEffect, useState } from "react";
import { Sun, Moon, Bell, UserCircle, Menu } from "lucide-react";
import { Link } from "react-router";
import { useThemeStore } from "../../stores/themeStore";
import { getProfile } from "../../services/profileService";
import "../../style/navbar.css";

function Navbar({ app = false, onMenu }) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    if (!app) return;

    let mounted = true;

    const syncProfile = (event) => {
      const user = event.detail;
      if (!mounted || !user) return;
      setProfilePhoto(user.profilePhoto || "");
      setProfileName(user.name || "");
    };

    getProfile()
      .then((response) => {
        if (!mounted) return;
        const user = response?.user || response?.data?.user;
        if (user) {
          setProfilePhoto(user.profilePhoto || "");
          setProfileName(user.name || "");
        }
      })
      .catch(() => {
        // The navbar stays usable if the profile request fails.
      });

    window.addEventListener("urpath:profile-updated", syncProfile);

    return () => {
      mounted = false;
      window.removeEventListener("urpath:profile-updated", syncProfile);
    };
  }, [app]);

  return (
    <header className={`navbar ${app ? "navbar--app" : "navbar--public"}`}>
      {!app && (
        <nav className="navbar__links">
          <a href="#who-we-are">Who We Are</a>
          <a href="#features">Features</a>
          <a href="#why-urpath">Why UrPath</a>
        </nav>
      )}

      <div className="navbar__actions">
        {app && (
          <button type="button" className="navbar__menu" onClick={onMenu} aria-label="Open navigation">
            <Menu size={20} strokeWidth={1.9} />
          </button>
        )}

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
            <Link to="/register" className="navbar__get-started">Get Started</Link>
          </>
        )}

        {app && (
          <Link
            to="/profile"
            className={`navbar__profile ${profilePhoto ? "navbar__profile--photo" : ""}`}
            aria-label={profileName ? `Profile: ${profileName}` : "Profile"}
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt="" />
            ) : (
              <UserCircle size={27} strokeWidth={1.6} />
            )}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
