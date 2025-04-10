import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { mailOutline, keyOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 200 && data.user) {
        const user = data.user;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user._id);
        localStorage.setItem("email", user.email);
        localStorage.setItem("name", user.name);
        localStorage.setItem("role", user.role);
      
        setMessage("Login Successful! Redirecting...");
      
        setTimeout(() => {
          if (user.role === "student") navigate("/student");
          else if (user.role === "teacher") navigate("/teacher");
          else if (user.role === "examiner") navigate("/examiner");
          else setMessage("Invalid role!");
        }, 1500);
      }
      else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error logging in.");
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2 className="title">Drone</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <IonIcon icon={mailOutline} />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <IonIcon icon={keyOutline} />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn">Log In</button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="extra-links">
          <span>New user?</span>
          <button className="register-btn" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
