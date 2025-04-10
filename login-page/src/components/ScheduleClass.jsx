import React, { useState } from "react";

const ScheduleClass = () => {
  const [typedCourse, setTypedCourse] = useState("");
  const [dateTime, setDateTime] = useState("");

  const teacherEmail = localStorage.getItem("userEmail");

  const handleSchedule = async () => {
    if (!typedCourse || !dateTime) {
      return alert("Please fill all fields");
    }

    try {
      // Step 1: Check if course already exists for this teacher
      const courseRes = await fetch(
        `http://localhost:5000/api/teacher/courses/by-email/${teacherEmail}`
      );
      const allCourses = await courseRes.json();

      let existingCourse = allCourses.find(
        (c) => c.title.toLowerCase() === typedCourse.toLowerCase()
      );

      let courseId = "";

      if (existingCourse) {
        courseId = existingCourse._id;
      } else {
        // Step 2: Create new course
        const createRes = await fetch(
          "http://localhost:5000/api/teacher/courses",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: typedCourse,
              description: "Auto-created while scheduling class",
              teacherEmail: teacherEmail,
            }),
          }
        );
        const createData = await createRes.json();
        courseId = createData.course._id;
      }

      // Step 3: Schedule the class
      const scheduleRes = await fetch(
        "http://localhost:5000/api/teacher/schedule",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, dateTime }),
        }
      );

      const scheduleData = await scheduleRes.json();
      alert(scheduleData.message);

      // Reset
      setTypedCourse("");
      setDateTime("");
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h2>Schedule Class Session</h2>

      <label>Course Title (Type New or Existing):</label>
      <input
        type="text"
        value={typedCourse}
        onChange={(e) => setTypedCourse(e.target.value)}
        placeholder="Enter course title..."
        className="input"
      />

      <label>Select Date and Time:</label>
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        className="input"
      />

      <button onClick={handleSchedule} className="btn">
        Schedule Class
      </button>
    </div>
  );
};

export default ScheduleClass;
