import { useState } from "react";
import { Link } from "react-router";
import { forgotPassword } from "../../services/authService";
import "../../style/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await forgotPassword(email.trim());

      setSuccess(
        data?.message ||
          "If an account exists with this email, a reset link has been sent."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send the reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
              ACCOUNT RECOVERY
            </span>

            <h1>Find your way back.</h1>

            <p>
              Enter your email and we'll send you a link
              to reset your password.
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
            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send reset link"}

              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-switch">
            Remember your password?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>

        </div>
      </section>

      <div className="auth-footer">
        <span>© 2026 UrPath</span>
        <span>Learn · Build · Grow</span>
      </div>
    </main>
  );
}

export default ForgotPassword;
