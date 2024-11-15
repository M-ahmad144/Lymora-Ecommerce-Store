const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  updatePasswordByUser,
  deleteUser,
  getUserById,
  updateUserByAdmin,
} = require("../controllers/userController");

// Middleware imports
const { authMiddleware, authAdmin } = require("../middlewares/authMiddleware");

// Public authentication routes
router.post("/register", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutCurrentUser);

// Protected routes
router.use(authMiddleware);

// Admin routes
router.get("/", authAdmin, getAllUsers);
router
  .route("/:id")
  .get(authAdmin, getUserById)
  .patch(authAdmin, updateUserByAdmin)
  .delete(authAdmin, deleteUser);

// Profile routes (user-protected routes)
router.get("/profile", getCurrentUserProfile);
router.patch("/profile", updateCurrentUserProfile);
router.patch("/profile/password", updatePasswordByUser);

module.exports = router;
