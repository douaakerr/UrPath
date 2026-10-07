import { useEffect, useRef, useState } from "react";
import { Camera, Check, UserCircle } from "lucide-react";
import { getProfile, updateProfile, uploadProfilePhoto, deleteProfilePhoto } from "../../services/profileService";
import "../../style/profile.css";

function Profile() {
  const inputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile().then((response) => {
      const next = response?.user || response?.data?.user;
      setUser(next);
      setName(next?.name || "");
    }).catch((err) => setError(err.response?.data?.message || "Unable to load profile."));
  }, []);

  const syncUser = (next) => {
    setUser(next);
    window.dispatchEvent(new CustomEvent("urpath:profile-updated", { detail: next }));
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await updateProfile({ name });
      const next = response?.user || response?.data?.user;
      syncUser(next);
      setName(next?.name || name);
      setMessage("Profile updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setMessage("");

    try {
      const response = await uploadProfilePhoto(file);
      const next = response?.user || response?.data?.user;
      syncUser(next);
      setMessage("Profile photo updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to upload photo.");
    }

    event.target.value = "";
  };

  const removePhoto = async () => {
    try {
      const response = await deleteProfilePhoto();
      const next = response?.user || response?.data?.user;
      syncUser(next);
      setMessage("Profile photo removed.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to remove photo.");
    }
  };

  if (!user && !error) return <main className="profile-page"><div className="progress-state">Loading profile...</div></main>;
  if (error && !user) return <main className="profile-page"><div className="progress-state progress-state--error">{error}</div></main>;

  return (
    <main className="profile-page">
      <header className="profile-header">
        <span>YOUR ACCOUNT</span>
        <h1>Profile</h1>
        <p>Keep your account details up to date.</p>
      </header>

      <section className="profile-card">
        <div className="profile-identity">
          <div className="profile-avatar">
            {user.profilePhoto ? <img src={user.profilePhoto} alt={user.name} /> : <UserCircle size={64} />}
            <button type="button" onClick={() => inputRef.current?.click()} aria-label="Change profile photo">
              <Camera size={17} />
            </button>
          </div>
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <small>{user.authProvider === "google" ? "Google account" : "Email account"}</small>
          </div>
        </div>

        <form onSubmit={save} className="profile-form">
          <label>
            Display name
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={50} />
          </label>
          <label>
            Email
            <input value={user.email} disabled />
          </label>

          <div className="profile-actions">
            <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
            {user.profilePhoto && (
              <button type="button" onClick={removePhoto} className="profile-remove">Remove photo</button>
            )}
          </div>

          {message && <p className="profile-success"><Check size={15} />{message}</p>}
          {error && <p className="profile-error">{error}</p>}
        </form>

        <input ref={inputRef} hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} />
      </section>
    </main>
  );
}

export default Profile;
