const User = require("../models/userModel");
const asyncHandler = require("../middlewares/asyncHandler");
const generateToken = require("../utils/token");

exports.createUser = asyncHandler(async (req, res) => {
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
