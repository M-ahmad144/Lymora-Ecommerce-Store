const User = require("../models/userModel");
const asyncHandler = require("../middlewares/asyncHandler");
const generateToken = require("../utils/token");
const ErrorHandler = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");

// sign-up
exports.signupUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new ErrorHandler("Please fill all the inputs.", 400));
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    return next(new ErrorHandler("User already exists", 400));
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

// login-user
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  // Check if password is correct
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
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

// logout-user
exports.logoutCurrentUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// get all users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    users,
  });
});

// current user profile
exports.getCurrentUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

// update current user profile
exports.updateCurrentUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return next(new ErrorHandler("User doesn't exist", 404));
  }

  if (req.body.password && req.body.currentPassword) {
    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isMatch) {
      return next(new ErrorHandler("Current password is incorrect", 400));
    }

    // Hash the new password and set it
    user.password = await bcrypt.hash(req.body.password, 12);
    user.passwordChangedAt = Date.now(); // Ensure tokens are invalidated if password is updated
  } else if (req.body.password || req.body.currentPassword) {
    return next(
      new ErrorHandler("Please provide both current and new passwords.", 400)
    );
  }

  // Update username and email if provided
  if (req.body.username) user.username = req.body.username;
  if (req.body.email) user.email = req.body.email;

  await user.save({ validateModifiedOnly: true }); // Only validate modified fields

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});
