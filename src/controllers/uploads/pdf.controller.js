import cloudinary from "../../config/cloudinary.js";
import fs from "fs";

export const uploadSyllabusPDF = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Upload PDF as "raw"
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      folder: "nexus/syllabus_pdfs"
    });

    // Delete temp file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      url: result.secure_url,  // Store this in DB
      public_id: result.public_id,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
