
import { useState } from "react";
import { LogIn, Mail, Lock, Eye, EyeOff, Users } from "lucide-react";
import "./Login.css";

const API = "http://localhost:5000/api/auth/login";

function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invalid email or password");
      }

      // Save JWT token
      localStorage.setItem("hcm_token", result.token);

      // Save logged-in user
      localStorage.setItem(
        "hcm_user",
        JSON.stringify(result.user)
      );

      // Tell App that login was successful
      if (onLogin) {
        onLogin(result.user);
      }
    } catch (err) {
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-glow glow-one"></div>
        <div className="login-glow glow-two"></div>
      </div>

      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <Users size={28} strokeWidth={2.4} />
          </div>

          <div>
            <h1>HCM Lite</h1>
            <p>Human Capital Management</p>
          </div>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h2>Welcome back 👋</h2>
          <p>
            Sign in to your HCM Lite administrator account.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">

          {/* Email */}
          <div className="login-field">
            <label htmlFor="email">
              Email Address
            </label>

            <div className="login-input-wrapper">
              <Mail size={18} />

              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="login-field">
            <label htmlFor="password">
              Password
            </label>

            <div className="login-input-wrapper">
              <Lock size={18} />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
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
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <span>HCM Lite</span>
          <span>•</span>
          <span>Admin Portal</span>
        </div>

      </div>
    </div>
  );
}

export default Login;