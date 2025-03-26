import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="welcome-container">
        <h1 className="welcome-heading">Welcome Back!</h1>
        <p className="welcome-message">
          Please enter your details to access your account
        </p>
      </div>

      <div className="login-modal">
        <div className="login-header">
          <h2>Login</h2>
        </div>

        <form className="login-form">
          <div className="form-groupL">
            <label className="labelL" htmlFor="email">
              Email or phone number
            </label>
            <input
              className="inputL"
              type="text"
              id="email"
              placeholder="Enter your email or phone"
            />
          </div>

          <div className="form-group password-group">
            <label className="labelL" htmlFor="password">
              Password
            </label>
            <div className="password-input-container">
              <input
                className="inputL"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <VisibilityOffIcon />
                ) : (
                  <VisibilityIcon />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="signup-prompt">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="signup-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;