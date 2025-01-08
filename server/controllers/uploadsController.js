const multer = require("multer");
const path = require("path");

// =========================
// Multer Configuration
// =========================

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set upload destination folder
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname); // Get file extension
    cb(null, `${file.fieldname}-${Date.now()}${extname}`); // Unique filename
  },
});

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpe?g|png|webp/; // Allowed extensions
  const allowedMimeTypes = /image\/jpe?g|image\/png|image\/webp/; // Allowed MIME types

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  // Check both extension and MIME type
  if (allowedFileTypes.test(extname) && allowedMimeTypes.test(mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only images (JPEG, PNG, WEBP) are allowed!"), false); // Reject file
  }
};

// Multer upload instance
const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

// =========================
// Controller for image upload
// =========================
const uploadSingleImageController = (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      // Handle multer errors (e.g., file type issues, size limit exceeded, etc.)
      return res.status(400).json({ message: err.message });
    }

    // Check if the file is available
    if (req.file) {
      // Successfully uploaded file, return the file path
      return res.status(200).json({
        message: "Image uploaded successfully",
        image: `/${req.file.path}`, // Return the path of the uploaded file
      });
    } else {
      // No file provided in the request
      return res.status(400).json({ message: "No image file provided" });
    }
  });
};

// Export the controller
module.exports = { uploadSingleImageController };
