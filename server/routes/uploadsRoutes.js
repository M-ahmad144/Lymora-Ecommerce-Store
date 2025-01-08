const express = require("express");
const {
  uploadSingleImageController,
} = require("../controllers/uploadsController");

const router = express.Router();

// Route for image upload
router.post("/", uploadSingleImageController);

module.exports = router;
