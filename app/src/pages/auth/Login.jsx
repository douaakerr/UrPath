import "../../style/auth.css";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import Navbar from "../../components/layout/Navbar";
import { loginUser } from "../../services/authService";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = await loginUser({
      email,
      password,
    });

    console.log("Login successful:", data);


  } catch (error) {
    console.error(
      error.response?.data?.message || "Login failed"
    );
  }
};

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

  return (
    <><Navbar />
    <main className="auth-page">

      <div className="auth-overlay" />

      {/* Brand */}
      <div className="auth-brand">
        <Link to="/" className="auth-logo">
          Ur<span>Path</span>
        </Link>

        <p>Develop yourself. Build your path.</p>
      </div>

      {/* Glass authentication panel */}
      <section className="auth-glass">
        <div className="auth-content">

          {/* Header */}
          <div className="auth-heading">
            <span className="auth-eyebrow">
              WELCOME BACK
            </span>

            <h1>Continue your journey.</h1>

            <p>
              Pick up where you left off and keep moving
              toward your goals.
            </p>
          </div>

          {/* Form */}
          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                Email
              </label>

             <input
  id="email"
  name="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="you@example.com"
  autoComplete="email"
  required
/>
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">
                  Password
                </label>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <div className="password-input">
               <input
  id="password"
  name="password"
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter your password"
  autoComplete="current-password"
  required
/>

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                      strokeWidth={1.8}
                    />
                  ) : (
                    <Eye
                      size={18}
                      strokeWidth={1.8}
                    />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-button"
            >
              Sign in
              <span>→</span>
            </button>
          </form>

          {/* Register */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/register">
              Create one
            </Link>
          </p>

        </div>
      </section>

      {/* Footer */}
      <div className="auth-footer">
        <span>© 2026 UrPath</span>
        <span>Learn · Build · Grow</span>
      </div>
    </main>
    </>
  );
}

export default Login;
