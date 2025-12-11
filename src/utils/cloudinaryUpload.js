import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadPDFToCloudinary = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "raw", // IMPORTANT for PDF
    folder: "course_pdfs", // your folder name
  });

  // Delete local temp file
  fs.unlinkSync(filePath);

  return result.secure_url; // Cloudinary URL
};
