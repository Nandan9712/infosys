import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import { accessibilityOutline, mailOutline, keyOutline, personOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
  });

  const [message, setMessage] = useState(""); // For success/error messages

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.status === 201) {
        setMessage("Registration Successful!");
        setTimeout(() => navigate("/"), 2000); // Redirect after success
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Error registering user.");
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h2 className="title">Drone Registration</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <div className="input-wrapper">
              <IonIcon icon={accessibilityOutline} />
              <input type="text" name="name" placeholder="First name" value={formData.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>Surname</label>
            <div className="input-wrapper">
              <input type="text" name="surname" placeholder="Last name" value={formData.surname} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <div className="input-wrapper">
              <IonIcon icon={mailOutline} />
              <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <IonIcon icon={keyOutline} />
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <IonIcon icon={keyOutline} />
              <input type="password" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label>Role</label>
            <div className="select-wrapper">
              <IonIcon icon={personOutline} />
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Examiner">Examiner</option>
              </select>
            </div>
          </div>

          <button type="submit" className="login-btn">Submit</button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="extra-links">
          <span>Already registered?</span>
          <a onClick={() => navigate("/")}>Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
