import React, { useEffect, useState } from "react";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [registeredCourseIds, setRegisteredCourseIds] = useState([]);
  const studentId = localStorage.getItem("userId");
  const studentEmail = localStorage.getItem("email");

  useEffect(() => {
    // Load all courses with sessions
    fetch("http://localhost:5000/api/courses/with-sessions")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error fetching courses:", err));

    // Fetch only current student's registered course IDs
    fetch(`http://localhost:5000/api/student/registered-courses/by-email/${studentEmail}`)
      .then((res) => res.json())
      .then((data) => {
        const courseIds = data.courseIds.map((id) => id.toString());
        setRegisteredCourseIds(courseIds);
      })
      .catch((err) => console.error("Error fetching registered courses:", err));
  }, [studentEmail]);

  const handleRegister = (courseId) => {
    fetch("http://localhost:5000/register-course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, courseId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Course registration successful") {
          alert("🎉 Registered successfully!");
          setRegisteredCourseIds((prev) => [...prev, courseId]);
        } else {
          alert("⚠️ " + data.message);
        }
      })
      .catch((err) => console.error("Registration error:", err));
  };

  return (
    <div className="course-container">
      <h2>Available Courses</h2>
      {courses.map((course) => {
        const isRegistered = registeredCourseIds.includes(course._id);
        return (
          <div key={course._id} className="course-card">
            <h3>{course.title}</h3>
            <p><strong>Description:</strong> {course.description}</p>
            <p><strong>Teacher:</strong> {course.teacherId?.name || "N/A"}</p>

            <h4>Sessions:</h4>
            {course.sessions.length > 0 ? (
              <ul>
                {course.sessions.map((session) => (
                  <li key={session._id}>
                    {new Date(session.dateTime).toLocaleString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No sessions scheduled.</p>
            )}

            {isRegistered ? (
              <p style={{ color: "red", fontWeight: "bold" }}>
                ⚠️ Already registered for this course
              </p>
            ) : (
              <button
                className="register-button"
                onClick={() => handleRegister(course._id)}
              >
                Register
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Courses;
