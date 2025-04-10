import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ExaminerDashboard = () => {
  const [examinerName, setExaminerName] = useState("Examiner");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setExaminerName(user.name || "Examiner");
    }
  }, []);

  return (
    <>
      <header className="header">
        <section className="flex">
          <a href="/examiner" className="logo">DRONE</a>
          <form action="#" method="post" className="search-form">
            <input type="text" name="search_box" required placeholder="Search..." maxLength="100" />
            <button type="submit" className="fas fa-search"></button>
          </form>
          <div className="icons">
            <div id="menu-btn" className="fas fa-bars"></div>
            <div id="search-btn" className="fas fa-search"></div>
            <div id="user-btn" className="fas fa-user"></div>
            <div id="toggle-btn" className="fas fa-sun"></div>
          </div>
          <div className="profile">
            <img src="/images/pic-1.jpg" className="image" alt="profile" />
            <h3 className="name">{examinerName}</h3>
            <p className="role">Examiner</p>
            <a href="/profile" className="btn">View Profile</a>
            <div className="flex-btn">
              <a href="/login" className="option-btn">Login</a>
              <a href="/register" className="option-btn">Register</a>
            </div>
          </div>
        </section>
      </header>

      <div className="side-bar">
        <div id="close-btn"><i className="fas fa-times"></i></div>
        <div className="profile">
          <img src="/images/pic-1.jpg" className="image" alt="profile" />
          <h3 className="name">{examinerName}</h3>
          <p className="role">Examiner</p>
          <a href="/profile" className="btn">View Profile</a>
        </div>
        <nav className="navbar">
          <a href="/examiner"><i className="fas fa-home"></i><span>Home</span></a>
          <a href="/examiner/slots"><i className="fas fa-clock"></i><span>Set Exam Availability</span></a>
          <a href="/examiner/requests"><i className="fas fa-user-clock"></i><span>Exam Requests</span></a>
          <a href="/examiner/results"><i className="fas fa-poll"></i><span>Review Results</span></a>
        </nav>
      </div>

      <section className="home-grid">
        <h1 className="heading">Examiner Quick Tools</h1>
        <div className="box-container">
          <div className="box">
            <h3 className="title">Actions</h3>
            <div className="flex">
              <a href="/examiner/slots"><i className="fas fa-clock"></i><span>Set Exam Availability</span></a>
              <a href="#"><i className="fas fa-file-alt"></i><span>Verify Attendance</span></a>
              <a href="#"><i className="fas fa-poll-h"></i><span>Publish Results</span></a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ExaminerDashboard;
