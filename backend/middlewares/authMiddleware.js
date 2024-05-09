const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
  // Get the token from the request header
  let token = req.header("Authorization"); // Change const to let

  // Check if token is missing
  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Authorization token is missing" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);
    console.log(user);

    // Check if user exists
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
    // Add userId to the user object
    user.userId = decoded.userId;

    // Attach the user object to the request for further use
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};

module.exports = { auth };
