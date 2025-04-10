import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const TeacherDashboard = () => {
  const [teacherName, setTeacherName] = useState("");
  const [teacherRole, setTeacherRole] = useState("Teacher");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setTeacherName(user.name);
      setTeacherRole(user.role.charAt(0).toUpperCase() + user.role.slice(1));
    }
  }, []);

  return (
    <>
      {/* Header */}
      <header className="header">
        <section className="flex">
          <a href="/teacher" className="logo">DRONE</a>
          <form className="search-form">
            <input
              type="text"
              name="search_box"
              required
              placeholder="Search..."
              maxLength="100"
            />
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
            <h3 className="name">{teacherName}</h3>
            <p className="role">{teacherRole}</p>
            <a href="/profile" className="btn">View Profile</a>
            <div className="flex-btn">
              <a href="/login" className="option-btn">Login</a>
              <a href="/register" className="option-btn">Register</a>
            </div>
          </div>
        </section>
      </header>

      {/* Sidebar */}
      <div className="side-bar">
        <div id="close-btn"><i className="fas fa-times"></i></div>
        <div className="profile">
          <img src="/images/pic-1.jpg" className="image" alt="profile" />
          <h3 className="name">{teacherName}</h3>
          <p className="role">{teacherRole}</p>
          <a href="/profile" className="btn">View Profile</a>
        </div>
        <nav className="navbar">
          <a href="/teacher"><i className="fas fa-home"></i><span>Home</span></a>
          <a href="/teacher/students"><i className="fas fa-users"></i><span>Course Roster</span></a>
          <a href="/teacher/schedule"><i className="fas fa-calendar-alt"></i><span>Schedule Classes</span></a>
        </nav>
      </div>

      {/* Main Dashboard Content */}
      <section className="home-grid">
        <h1 className="heading">Teacher Quick Actions</h1>
        <div className="box-container">
          <div className="box">
            <h3 className="title">Manage</h3>
            <div className="flex">
              <a href="#"><i className="fas fa-book"></i><span>Materials</span></a>
              <a href="#"><i className="fas fa-user-edit"></i><span>Attendance</span></a>
              <a href="#"><i className="fas fa-clipboard-check"></i><span>Assessments</span></a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeacherDashboard;
