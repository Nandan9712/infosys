import React, { useState } from "react";

const TeacherCourses = () => {
  const [course, setCourse] = useState({ title: "", description: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await fetch("http://localhost:5000/api/teacher/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...course, teacherId: user._id }),
      });
      const data = await res.json();
      setMessage(data.message);
      setCourse({ title: "", description: "" });
    } catch (err) {
      setMessage("Error creating course");
    }
  };

  return (
    <div className="container">
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Course Title" value={course.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Course Description" value={course.description} onChange={handleChange} required />
        <button type="submit">Create</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default TeacherCourses;
