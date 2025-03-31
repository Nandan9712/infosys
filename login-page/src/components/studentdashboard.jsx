import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import {
  menuOutline,
  searchOutline,
  bookOutline,
  calendarOutline,
  checkmarkDoneOutline,
  logOutOutline,
  playOutline,
} from "ionicons/icons";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/dashboard.css";

const trainingSessions = [
  { id: 1, title: "Drone Basics", videoUrl: "https://www.youtube.com/embed/2Ji-clqUYnA" },
  { id: 2, title: "Advanced Navigation", videoUrl: "https://www.youtube.com/embed/3JluqTojuME" },
  { id: 3, title: "Safety Protocols", videoUrl: "https://www.youtube.com/embed/zJSY8tbf_ys" },
];

const StudentDashboard = () => {
  const [isActive, setIsActive] = useState(false);
  const [activeSection, setActiveSection] = useState("training");
  const [completedTrainings, setCompletedTrainings] = useState({});
  const [selectedTraining, setSelectedTraining] = useState(null);

  const handleTrainingCompletion = (id) => {
    setCompletedTrainings((prev) => ({ ...prev, [id]: true }));
    setSelectedTraining(null);
  };

  const handleSlotSelection = (info) => {
    if (!Object.keys(completedTrainings).length) {
      alert("Complete the training before booking an exam!");
      return;
    }
    alert(`Exam slot booked on ${info.dateStr}`);
  };

  return (
    <div className={`container1 ${isActive ? "active" : ""}`}>
      <div className={`navigation ${isActive ? "active" : ""}`}>
        <ul>
          <li onClick={() => setActiveSection("training")}> 
            <a href="#">
              <span className="icon"><IonIcon icon={bookOutline} /></span>
              <span className="title">Training Sessions</span>
            </a>
          </li>
          <li onClick={() => setActiveSection("exam")}> 
            <a href="#">
              <span className="icon"><IonIcon icon={calendarOutline} /></span>
              <span className="title">Book Exam</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon"><IonIcon icon={logOutOutline} /></span>
              <span className="title">Logout</span>
            </a>
          </li>
        </ul>
      </div>

      <div className={`main ${isActive ? "active" : ""}`}>
        <div className="topbar">
          <div className="toggle" onClick={() => setIsActive(!isActive)}>
            <IonIcon icon={menuOutline} />
          </div>
        </div>

        <div className="content">
          {activeSection === "training" && (
            <div>
              <h2>Training Sessions</h2>
              {!selectedTraining ? (
                <div className="training-list">
                  {trainingSessions.map(session => (
                    <div key={session.id} className="training-card">
                      <h3>{session.title}</h3>
                      <button onClick={() => setSelectedTraining(session)}>Start Training</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="training-video">
                  <iframe
                    className="course-video"
                    src={selectedTraining.videoUrl}
                    title={selectedTraining.title}
                    allowFullScreen
                  ></iframe>
                  <button onClick={() => handleTrainingCompletion(selectedTraining.id)}>
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSection === "exam" && (
            <div>
              <h2>Book Exam Slot</h2>
              {Object.keys(completedTrainings).length === trainingSessions.length ? (
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  selectable={true}
                  select={handleSlotSelection}
                />
              ) : (
                <p>Please complete all training sessions before booking an exam.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;