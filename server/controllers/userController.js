const User = require("../models/userModel");
const asyncHandler = require("../middlewares/asyncHandler");
const generateToken = require("../utils/token");

//sign-up
exports.signupUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs.");
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const newUser = await User.create({ username, email, password });
  // Generate token and set it as a cookie
  generateToken(res, newUser._id);
  res.status(201).json({
    success: true,
    user: {
      id: newUser._id,
      name: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    },
  });
});

//login-user
exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // Check if password is correct
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  generateToken(res, user._id);

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

//logout-user
exports.logoutCurrentUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};
