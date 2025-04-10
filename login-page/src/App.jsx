import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/studentdashboard";
import TeacherDashboard from "./components/teacherdashboard";
import ExaminerDashboard from "./components/examinerdashboard";
import TeacherCourses from "./components/TeacherCourses";
import ScheduleClass from "./components/ScheduleClass";
import Courses from "./components/courses"; // Import the new component
import ExaminerSlots from "./components/Examinerslots";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<Dashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/examiner" element={<ExaminerDashboard />} />
        <Route path="/teacher/courses" element={<TeacherCourses />} />
        <Route path="/teacher/schedule" element={<ScheduleClass />} />
        <Route path="/courses" element={<Courses />} /> 
        <Route path="/examiner/slots" element={<ExaminerSlots />} />
      </Routes>
    </Router>
  );
}

export default App;
