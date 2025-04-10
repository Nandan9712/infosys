require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ====== MongoDB Connection ======
mongoose
  .connect("mongodb://localhost:27017/minor_project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));


// ====== SCHEMAS ======
const VALID_ROLES = ["student", "teacher", "examiner"];

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: VALID_ROLES,
    required: true,
  },
});
const User = mongoose.model("User", userSchema);

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Course = mongoose.model("Course", CourseSchema);

const ClassSessionSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  dateTime: Date,
});
const ClassSession = mongoose.model("ClassSession", ClassSessionSchema);

const StudentCourseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});
const StudentCourse = mongoose.model("StudentCourse", StudentCourseSchema);

const examinerSlotSchema = new mongoose.Schema({
  examinerId: String,
  examinerName: String,
  fromTime: String,
  toTime: String,
});

const ExaminerSlot = mongoose.model("ExaminerSot", examinerSlotSchema);


const RegisteredCourseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  studentEmail: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

const RegisteredCourse = mongoose.model("RegisteredCourse", RegisteredCourseSchema);
// ====== ROUTES ======

// Register user
app.post("/register", async (req, res) => {
  try {
    const { name, surname, email, password, role } = req.body;

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists!" });

    const newUser = new User({ name, surname, email, password, role });
    await newUser.save();
    res.status(201).json({ message: "Registration Successful!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found!" });
    if (user.password !== password)
      return res.status(401).json({ message: "Invalid credentials!" });

    const { name, role, _id } = user;

    // ✅ Print user info here
    console.log("Login successful!");
    console.log("User ID:", _id);
    console.log("Role:", role);
    console.log("Email:", email);

    res.status(200).json({
      message: "Login successful!",
      user: { name, email, role, _id },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Teacher: Create Course
app.post("/api/teacher/courses", async (req, res) => {
  const { title, description, teacherEmail } = req.body;
  try {
    const teacher = await User.findOne({ email: teacherEmail, role: "teacher" });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const course = new Course({ title, description, teacherId: teacher._id });
    await course.save();
    res.json({ message: "Course created!", course });
  } catch (err) {
    res.status(500).json({ message: "Error creating course" });
  }
});

// Get courses by teacher ID
app.get("/api/teacher/courses/:teacherId", async (req, res) => {
  const { teacherId } = req.params;
  try {
    const courses = await Course.find({ teacherId });
    res.json(courses);
  } catch {
    res.status(500).json({ message: "Error fetching courses" });
  }
});

app.get("/api/teacher/courses/by-email/:email", async (req, res) => {
  try {
    const teacher = await User.findOne({ email: req.params.email, role: "teacher" });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const courses = await Course.find({ teacherId: teacher._id });
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses by teacher email:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Student: Get registered course IDs by email
app.get("/api/student/registered-courses/by-email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const registrations = await StudentCourse.find({ studentId: user._id }).populate("courseId");
    const courseIds = registrations.map((reg) => reg.courseId._id);

    res.json({ courseIds });
  } catch (error) {
    console.error("Error fetching registered courses by email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Teacher: Schedule class session
app.post("/api/teacher/schedule", async (req, res) => {
  const { courseId, dateTime } = req.body;
  try {
    const session = new ClassSession({ courseId, dateTime });
    await session.save();
    res.json({ message: "Class scheduled!" });
  } catch {
    res.status(500).json({ message: "Error scheduling class" });
  }
});

// Student: View all courses with sessions
app.get("/api/courses/with-sessions", async (req, res) => {
  try {
    const courses = await Course.find().populate("teacherId", "name").lean();
    const sessions = await ClassSession.find();

    const sessionMap = {};
    sessions.forEach((session) => {
      const id = session.courseId.toString();
      if (!sessionMap[id]) sessionMap[id] = [];
      sessionMap[id].push(session);
    });

    const combined = courses.map((course) => ({
      ...course,
      sessions: sessionMap[course._id.toString()] || [],
    }));

    res.json(combined);
  } catch (err) {
    res.status(500).json({ message: "Error loading course data" });
  }
});

// Student: Register for a course
app.post("/register-course", async (req, res) => {
  try {
    const { courseId, studentId, studentEmail } = req.body;

    // Check if already registered
    const existing = await StudentCourse.findOne({ courseId, studentId });
    if (existing) {
      return res.status(400).json({ message: "Already registered for this course" });
    }

    // Register new course
    const registration = new StudentCourse({
      courseId: new mongoose.Types.ObjectId(courseId),
      studentId: new mongoose.Types.ObjectId(studentId),
      studentEmail,
    });

    await registration.save();

    console.log("✅ Course registered:");
    console.log("Student ID:", studentId);

    console.log("Course ID:", courseId);

    res.status(201).json({ message: "Registered successfully", registration });
  } catch (error) {
    console.error("Course registration error:", error);
    res.status(500).json({ message: "Error registering course" });
  }
});



// Student: View registered courses with session info
app.get("/api/student/registered-courses/:studentId", async (req, res) => {
  const { studentId } = req.params;
  try {
    const regs = await StudentCourse.find({ studentId }).populate({
      path: "courseId",
      populate: { path: "teacherId", select: "name" },
    });

    const courseIds = regs.map((r) => r.courseId._id);
    const sessions = await ClassSession.find({ courseId: { $in: courseIds } });

    const courseSessions = {};
    sessions.forEach((s) => {
      const cid = s.courseId.toString();
      if (!courseSessions[cid]) courseSessions[cid] = [];
      courseSessions[cid].push({
        dateTime: s.dateTime,
        daysRemaining: Math.ceil((new Date(s.dateTime) - new Date()) / (1000 * 60 * 60 * 24)),
      });
    });

    const output = regs.map((r) => ({
      _id: r.courseId._id,
      title: r.courseId.title,
      description: r.courseId.description,
      teacherName: r.courseId.teacherId.name,
      sessions: courseSessions[r.courseId._id.toString()] || [],
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Sample
    }));

    res.json(output);
  } catch (err) {
    res.status(500).json({ message: "Error fetching registered courses" });
  }
});

// Student: Get registered course IDs (raw)
app.get("/api/student/registered-courses", async (req, res) => {
  const email = req.query.email;

  try {
    const student = await User.findOne({ email, role: "student" });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const registeredCourses = await StudentCourse.find({ studentId: student._id });
    res.json(registeredCourses);
  } catch (err) {
    console.error("Error fetching student registered courses:", err);
    res.status(500).json({ error: "Failed to fetch registered courses" });
  }
});

// Save availability
app.post("/api/examiner/slots", async (req, res) => {
  const { examinerId, examinerName, fromTime, toTime } = req.body;
  console.log("Incoming slot data:", { examinerId, examinerName, fromTime, toTime });

  if (!examinerId || !fromTime || !toTime) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const slot = new ExaminerSlot({
      examinerId,
      examinerName,
      fromTime,
      toTime,
    });
    const savedSlot = await slot.save();
    console.log("Saved slot:", savedSlot);
    res.status(200).json({ message: "Slot saved successfully." });
  } catch (err) {
    console.error("Failed to save slot:", err);
    res.status(500).json({ message: "Error saving slot." });
  }
});


// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
