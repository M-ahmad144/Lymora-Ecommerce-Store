const express = require("express");
const router = express.Router();

const {
  signupUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} = require("../controllers/userController");

const { authMiddleware, authAdmin } = require("../middlewares/authMiddleware");

router.route("/").post(signupUser).get(authMiddleware, authAdmin, getAllUsers);
router
  .route("/profile")
  .get(authMiddleware, getCurrentUserProfile)
  .patch(authMiddleware, updateCurrentUserProfile);

// Public routes
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

module.exports = router;
