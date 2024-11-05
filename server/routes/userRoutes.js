const express = require("express");
const router = express.Router();

const {
  signupUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers, 
} = require("../controllers/userController");

const { authMiddleware, authAdmin } = require("../middlewares/authMiddleware");


router
  .route("/")
  .post(signupUser) 
  .get(authMiddleware, authAdmin, getAllUsers); /

// Public login and logout routes
router.post("/auth", loginUser); 
router.post("/logout", logoutCurrentUser); 

module.exports = router;
