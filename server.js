require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const dns = require("dns");

const User = require("./models/User");
const Post = require("./models/Post");

const app = express();
const PORT = process.env.PORT;

dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
// middleware used to parse json request bodies

app.use(cors())
app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, { family: 4 });
    console.log(`Mongo db connected : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB : ${error.message}`);
    process.exit(1);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "Blue blades server is running and healthy!",
  });
});

app.post("/api/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await User.create({ name, email });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: " Email already registered",
      });
    }
    res
      .status(500)
      .json({ message: "Failed to create User", error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
