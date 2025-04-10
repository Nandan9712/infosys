import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const StudentDashboard = () => {
  const [userName, setUserName] = useState("Student");
  const [view, setView] = useState("home");
  const [courses, setCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUserName(user.name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/courses/with-sessions");
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchRegistered = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:5000/registered-courses/${user._id}`);
      const data = await res.json();
      setRegisteredCourses(data);
    } catch (err) {
      console.error("Error fetching registered courses:", err);
    }
  };

  const handleRegister = async (courseId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("User not logged in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/register-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentEmail: user.email, courseId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Course registered successfully!");
        fetchRegistered();
        setSelectedCourse(null);
        setView("contact");
      } else {
        alert(`⚠️ ${data.message}`);
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Something went wrong during registration.");
    }
  };

  const daysUntil = (dateStr) => {
    const now = new Date();
    const target = new Date(dateStr);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff} days left` : "Started/Completed";
  };

  useEffect(() => {
    if (view === "courses" || view === "contact") {
      fetchCourses();
      fetchRegistered();
    }
  }, [view]);

  const isCourseRegistered = (courseId) => {
    return registeredCourses.some((rc) => {
      return (
        rc._id === courseId ||
        rc.courseId === courseId ||
        (rc.courseId?._id === courseId)
      );
    });
  };

  const getCourseData = (course) => {
    // Normalize structure for registeredCourses
    return {
      _id: course._id || course.courseId?._id,
      title: course.title || course.courseId?.title || "Untitled Course",
      teacher: course.teacherId?.name || course.courseId?.teacherId?.name || "Unknown",
      sessions: course.sessions || course.courseId?.sessions || [],
    };
  };

  return (
    <div>
      <header className="header">
        <section className="flex">
          <a href="#" className="logo">DRONE</a>
          <form action="#" className="search-form">
            <input type="text" name="search_box" placeholder="Search..." />
            <button type="submit" className="fas fa-search"></button>
          </form>
          <div className="icons">
            <div id="menu-btn" className="fas fa-bars"></div>
            <div id="search-btn" className="fas fa-search"></div>
            <div id="user-btn" className="fas fa-user"></div>
            <div id="toggle-btn" className="fas fa-sun"></div>
          </div>
          <div className="profile">
            <img src="/images/pic-1.jpg" alt="" className="image" />
            <h3 className="name">{userName}</h3>
            <p className="role">Student</p>
            <a href="#" className="btn">View Profile</a>
            <div className="flex-btn">
              <button onClick={handleLogout} className="option-btn">Logout</button>
            </div>
          </div>
        </section>
      </header>

      <div className="side-bar">
        <div id="close-btn"><i className="fas fa-times"></i></div>
        <div className="profile">
          <img src="/images/pic-1.jpg" className="image" alt="" />
          <h3 className="name">{userName}</h3>
          <p className="role">Student</p>
          <a href="#" className="btn">View Profile</a>
          <button onClick={handleLogout} className="option-btn" style={{ marginTop: "1rem" }}>
            Logout
          </button>
        </div>
        <nav className="navbar">
          <a href="#" onClick={() => setView("home")}><i className="fas fa-home"></i><span>Home</span></a>
          <a href="#" onClick={() => { setView("courses"); setSelectedCourse(null); }}><i className="fas fa-graduation-cap"></i><span>Courses</span></a>
          <a href="#" onClick={() => setView("exams")}><i className="fas fa-file-alt"></i><span>Exams</span></a>
          <a href="#" onClick={() => setView("contact")}><i className="fas fa-book"></i><span>My Courses</span></a>
          <a href="#" onClick={() => setView("completed")}><i className="fas fa-check-circle"></i><span>Completed</span></a>
          <a href="#" onClick={() => setView("certificates")}><i className="fas fa-certificate"></i><span>Certificates</span></a>
        </nav>
      </div>

      <section className="home-grid">
        <h1 className="heading">
          {view === "home" && "Quick Options"}
          {view === "courses" && "Available Courses"}
          {view === "contact" && "My Courses"}
          {view === "exams" && "Upcoming Exams"}
          {view === "completed" && "Completed Courses"}
          {view === "certificates" && "Certificates"}
        </h1>

        {view === "home" && (
          <div className="box-container">
            <div className="box">
              <h3 className="title">Top Categories</h3>
              <div className="flex">
                <a href="#"><i className="fas fa-code"></i><span>Development</span></a>
                <a href="#"><i className="fas fa-chart-simple"></i><span>Business</span></a>
                <a href="#"><i className="fas fa-pen"></i><span>Design</span></a>
                <a href="#"><i className="fas fa-chart-line"></i><span>Marketing</span></a>
              </div>
            </div>
          </div>
        )}

        {view === "courses" && !selectedCourse && (
          <div className="box-container">
            {courses.map((course) => {
              const isRegistered = isCourseRegistered(course._id);
              return (
                <div key={course._id} className="box">
                  <div className="tutor">
                    <img src="/images/pic-2.jpg" alt="tutor" />
                    <div className="info">
                      <h3>{course.teacherId?.name || "Teacher"}</h3>
                    </div>
                  </div>
                  <div className="thumb">
                    <img src="/images/thumb-1.png" alt="course" />
                    <span>{course.sessions.length} Sessions</span>
                  </div>
                  <h3 className="title">{course.title}</h3>
                  <button
                    className="inline-btn"
                    onClick={() => setSelectedCourse(course)}
                    disabled={isRegistered}
                  >
                    {isRegistered ? "Already Registered" : "Details"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {selectedCourse && (
          <div className="modal-overlay">
            <div className="modal-box">
              <button className="close-btn" onClick={() => setSelectedCourse(null)}>✖</button>
              <h2>{selectedCourse.title}</h2>
              <p><strong>Teacher:</strong> {selectedCourse.teacherId?.name || "Unknown"}</p>
              <p><strong>Description:</strong> {selectedCourse.description || "No description"}</p>
              <h4>Sessions:</h4>
              <ul>
                {selectedCourse.sessions.map((s, idx) => (
                  <li key={idx}>
                    {new Date(s.dateTime).toLocaleString()} ({daysUntil(s.dateTime)})
                  </li>
                ))}
              </ul>
              {isCourseRegistered(selectedCourse._id) ? (
                <p><em>✅ You are already registered in this course.</em></p>
              ) : (
                <button className="inline-btn" onClick={() => handleRegister(selectedCourse._id)}>
                  Register
                </button>
              )}
            </div>
          </div>
        )}

        {view === "contact" && (
          <div className="box-container">
            {registeredCourses.map((rawCourse) => {
              const course = getCourseData(rawCourse);
              return (
                <div key={course._id} className="box">
                  <div className="thumb">
                    <img src="/images/thumb-1.png" alt="course" />
                    <span>{course.sessions.length} Sessions</span>
                  </div>
                  <h3 className="title">{course.title}</h3>
                  <p><strong>Teacher:</strong> {course.teacher}</p>
                  <h4>Upcoming Sessions:</h4>
                  <ul>
                    {course.sessions.map((s, i) => (
                      <li key={i}>{new Date(s.dateTime).toLocaleString()} ({daysUntil(s.dateTime)})</li>
                    ))}
                  </ul>
                  <div className="video">
                    <iframe
                      width="100%"
                      height="200"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Course Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "exams" && <p>Exams section coming soon!</p>}
        {view === "completed" && <p>Your completed courses will appear here.</p>}
        {view === "certificates" && <p>Your certificates will be available here.</p>}
      </section>
    </div>
  );
};

export default StudentDashboard;
