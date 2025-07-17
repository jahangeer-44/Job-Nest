import multer from "multer";

// Memory storage for direct uploads to Cloudinary
const storage = multer.memoryStorage();

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, and PNG image files are allowed"), false);
  }
};

// Exported middleware for single file upload
export const singleUpload = multer({ storage, fileFilter }).single("file");
