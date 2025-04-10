// src/pages/ExaminerSlots.jsx
import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";

const ExaminerSlots = () => {
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "examiner") {
      alert("Only examiners can access this functionality.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/examiner/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examinerId: user._id,
          examinerName: user.name,
          fromTime,
          toTime,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Slot added successfully!");
        setFromTime("");
        setToTime("");
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error("Failed to add slot:", err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="container">
      <section className="home-grid">
        <h1 className="heading">Add Your Exam Slot Availability</h1>
        <form onSubmit={handleSubmit} className="form">
          <label>From Time:</label>
          <input
            type="datetime-local"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            required
          />

          <label>To Time:</label>
          <input
            type="datetime-local"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            required
          />

          <button type="submit" className="inline-btn">Add Slot</button>
          {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
        </form>
      </section>
    </div>
  );
};

export default ExaminerSlots;
