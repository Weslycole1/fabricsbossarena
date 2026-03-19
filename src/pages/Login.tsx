import React, { useState } from "react";
import "./login.css";
import fabricImage from "../assets/Untitled-design-42-2.png"; 
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [activeForm, setActiveForm] = useState<"signup" | "login">("signup");

  const navigate = useNavigate();

  // When user logs in
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home"); // <-- takes user to Products page
  };

  // When user signs up
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/home"); // <-- also take them to Products page
  };

  return (
    <div className="main">
      {/* LEFT SIDE IMAGE */}
      <div className="box1">
        <img src={fabricImage} alt="Fabric Display" />

        <div className="text-overlay">
          <h2>Where Elegance Meets Every Thread</h2>
          <p>
            Discover premium fabrics crafted for comfort, style, and timeless
            quality.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE AREA */}
      <div className="box2">
        <h1>Welcome to FabricBossArena</h1>

        {/* TOGGLE BUTTONS */}
        <div className="form-toggle">
          <button
            className={activeForm === "signup" ? "active" : ""}
            onClick={() => setActiveForm("signup")}
          >
            Sign Up
          </button>

          <button
            className={activeForm === "login" ? "active" : ""}
            onClick={() => setActiveForm("login")}
          >
            Login
          </button>
        </div>

        {/* SIGNUP FORM */}
        <form
          className={activeForm === "signup" ? "active" : ""}
          onSubmit={handleSignup}
        >
          <div className="name-fields">
            <input type="text" placeholder="First Name" required />
            <input type="text" placeholder="Surname" required />
          </div>

          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />

          <input type="submit" value="Sign Up" />
        </form>

        {/* LOGIN FORM */}
        <form
          className={activeForm === "login" ? "active" : ""}
          onSubmit={handleLogin}
        >
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />

          <div className="options-row">
            <label className="remember-me">
              <input type="checkbox" /> Remember Me
            </label>

            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <input type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
};

export default Login;

