require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());


mongoose
  .connect("mongodb://localhost:27017/minor_project", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const studentSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  role: String,
});


const Student = mongoose.model("Student", studentSchema);

app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Student.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials!" });
      }
      res.status(200).json({ message: "Login successful!", user });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

app.post("/register", async (req, res) => {
  try {
    const { name, surname, email, password, role } = req.body;

    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const newStudent = new Student({ name, surname, email, password, role });
    await newStudent.save();

    res.status(201).json({ message: "Registration Successful!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
