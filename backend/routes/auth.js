

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Middleware to authenticate JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, phoneNumber, password } = req.body;
    if (!username || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or phone number already exists" });
    }
    const user = await User.create({ username, phoneNumber, password });
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ token, username: user.username, phoneNumber: user.phoneNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }
    const user = await User.findOne({ phoneNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token, username: user.username, phoneNumber: user.phoneNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Profile
router.put("/profile", authenticate, async (req, res) => {
  try {
    const { username, phoneNumber, password, currentPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify current password for sensitive changes
    if (password && !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Check for unique username/phoneNumber
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) return res.status(400).json({ message: "Username already exists" });
      user.username = username;
    }
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      if (!/^\d{10}$/.test(phoneNumber)) {
        return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
      }
      const existingPhoneNumber = await User.findOne({ phoneNumber });
      if (existingPhoneNumber) return res.status(400).json({ message: "Phone number already exists" });
      user.phoneNumber = phoneNumber;
    }
    if (password) {
      user.password = password; // Will be hashed by pre-save hook
    }

    await user.save();

    // Generate new token if username changed
    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, username: user.username, phoneNumber: user.phoneNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;