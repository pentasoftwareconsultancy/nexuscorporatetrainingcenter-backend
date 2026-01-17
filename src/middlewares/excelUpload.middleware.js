// middlewares/excelUpload.middleware.js
import multer from "multer";

const storage = multer.memoryStorage();

export const excelUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
