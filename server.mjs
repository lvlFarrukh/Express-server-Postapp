import express from "express";
import morgan from "morgan";
import cors from "cors";
import multer from "multer";
import { storage, fileFilter } from "./utiles/UploadImage.mjs";

const port = process.env.PORT || 3000;
const app = express();

const upload = multer({ storage, fileFilter });

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Server is working");
});

// Create a POST route for uploading images
app.post("/upload", upload.array("images", 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded." });
  }

  // If files were successfully uploaded, you can access them using req.files
  const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
  res.json({ message: "Files uploaded successfully.", imageUrls });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
