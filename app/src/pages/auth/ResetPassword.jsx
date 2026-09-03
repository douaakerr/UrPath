import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { resetPassword } from "../../services/authService";
import "../../style/auth.css";
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const data = await resetPassword(token, password);

      setSuccess(data?.message || "Password reset successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Reset password error:", err);

      setError(err.response?.data?.message || "Unable to reset your password.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="auth-page">
      {" "}
      <div className="auth-overlay" />{" "}
      <div className="auth-brand">
        {" "}
        <Link to="/" className="auth-logo">
          {" "}
          Ur<span>Path</span>{" "}
        </Link>{" "}
        <p>Develop yourself. Build your path.</p>{" "}
      </div>{" "}
      <section className="auth-glass">
        {" "}
        <div className="auth-content">
          {" "}
          <div className="auth-heading">
            {" "}
            <span className="auth-eyebrow"> RESET PASSWORD </span>{" "}
            <h1>Create a new password.</h1>{" "}
            <p>
              {" "}
              Choose a strong password to keep your UrPath account secure.{" "}
            </p>{" "}
          </div>{" "}
          {error && (
            <div className="auth-message auth-error"> {error} </div>
          )}{" "}
          {success && (
            <div className="auth-message auth-success"> {success} </div>
          )}{" "}
          <form className="auth-form" onSubmit={handleSubmit}>
            {" "}
            <div className="form-group">
              {" "}
              <label htmlFor="password"> New password </label>{" "}
              <div className="password-input">
                {" "}
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                />{" "}
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {" "}
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            <div className="form-group">
              {" "}
              <label htmlFor="confirmPassword">
                {" "}
                Confirm new password{" "}
              </label>{" "}
              <div className="password-input">
                {" "}
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  required
                />{" "}
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {" "}
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            <button type="submit" className="auth-button" disabled={loading}>
              {" "}
              {loading ? "Resetting..." : "Reset password"}{" "}
              {!loading && <span>→</span>}{" "}
            </button>{" "}
          </form>{" "}
          <p className="auth-switch">
            {" "}
            Remember your password? <Link to="/login"> Sign in </Link>{" "}
          </p>{" "}
        </div>{" "}
      </section>{" "}
      <div className="auth-footer">
        {" "}
        <span>© 2026 UrPath</span> <span>Learn · Build · Grow</span>{" "}
      </div>{" "}
    </main>
  );
}
export default ResetPassword;
