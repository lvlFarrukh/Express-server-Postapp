import multer from "multer";
import path from "path";

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Rename the file with a unique timestamp
  },
});

export const fileFilter = (req, file, cb) => {
  // Accept only image files (you can customize this)
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."));
  }
};
