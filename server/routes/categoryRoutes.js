const express = require("express");
const router = express.Router();
const { authMiddleware, authAdmin } = require("../middlewares/authMiddleware");

const {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} = require("../controllers/categoryController");

router.route("/").post(createCategory);

module.exports = router;
