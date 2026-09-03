import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { changePassword } from "../../services/authService";
import "../../style/auth.css";
import Navbar from "../../components/layout/Navbar";

function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setSuccess(
        data?.message ||
          "Your password has been changed successfully."
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to change your password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <main className="auth-page">
      <div className="auth-overlay" />

      <div className="auth-brand">
        <Link to="/" className="auth-logo">
          Ur<span>Path</span>
        </Link>

        <p>Develop yourself. Build your path.</p>
      </div>

      <section className="auth-glass">
        <div className="auth-content">

          <div className="auth-heading">
            <span className="auth-eyebrow">
              ACCOUNT SECURITY
            </span>

            <h1>Change your password.</h1>

            <p>
              Keep your account secure with a strong,
              unique password.
            </p>
          </div>

          {error && (
            <div className="auth-message auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-message auth-success">
              {success}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {/* Current password */}
            <div className="form-group">
              <label htmlFor="currentPassword">
                Current password
              </label>

              <div className="password-input">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your current password"
                  autoComplete="current-password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowCurrentPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showCurrentPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New password */}
            <div className="form-group">
              <label htmlFor="newPassword">
                New password
              </label>

              <div className="password-input">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowNewPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showNewPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm new password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm new password
              </label>

              <div className="password-input">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? "Changing..."
                : "Change password"}

              {!loading && <span>→</span>}
            </button>
          </form>

          <p className="auth-switch">
            <Link to="/profile">
              ← Back to profile
            </Link>
          </p>

        </div>
      </section>

      <div className="auth-footer">
        <span>© 2026 UrPath</span>
        <span>Learn · Build · Grow</span>
      </div>
    </main>
    </>
  );
}

export default ChangePassword;
