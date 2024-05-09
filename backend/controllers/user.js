const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

// Register a new user
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully",
        username: newUser.username,
        newUser,
        token,
      });
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid username or password" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "User Logged In",
        username: user.username,
        user,
        token,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

module.exports = { register, login };
