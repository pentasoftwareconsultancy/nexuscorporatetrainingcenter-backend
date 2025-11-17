// import cloudinary from "../config/cloudinary.js";
// import path from "path";

// // Import all models
// import { User } from "../models/user.model.js";
// import { Course } from "../models/course.model.js";
// import { Video } from "../models/video.model.js";
// import { Event } from "../models/event.model.js";
// import { EventImage } from "../models/eventImage.model.js";
// import { College } from "../models/college.model.js";
// import { CollegeImage } from "../models/collegeImage.model.js";

// export const uploadFile = async (req, res) => {
//   try {
//     const { type, refId } = req.query; // refId = course_id, event_id, etc.
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const isVideo = req.file.mimetype.startsWith("video/");
//     const folder = `${type}_uploads`;
//     const originalName = path.parse(req.file.originalname).name;

//     const uploadStream = () =>
//       new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           {
//             resource_type: isVideo ? "video" : "image",
//             folder,
//             public_id: `${type}_${Date.now()}_${originalName}`,
//             chunk_size: 6000000,
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );
//         stream.end(req.file.buffer);
//       });

//     const result = await uploadStream();

//     let record;

//     switch (type) {
//       case "user":
//         record = await User.create({
//           name: "Sample User",
//           profileImage: result.secure_url,
//         });
//         break;

//       case "course":
//         record = await Course.create({
//           title: "New Course",
//           thumbnail: result.secure_url,
//         });
//         break;

//       case "video":
//         record = await Video.create({
//           title: req.file.originalname,
//           url: result.secure_url,
//         });
//         break;

//       case "event-image":
//         if (!refId) {
//           return res.status(400).json({ message: "Missing event_id (refId)" });
//         }
//         record = await EventImage.create({
//           event_id: refId,
//           image_url: result.secure_url,
//         });
//         break;

//       case "college-image":
//         if (!refId) {
//           return res
//             .status(400)
//             .json({ message: "Missing college_id (refId)" });
//         }
//         record = await CollegeImage.create({
//           college_id: refId,
//           image_url: result.secure_url,
//         });
//         break;

//       default:
//         return res.status(400).json({ message: "Invalid type" });
//     }

//     res.json({
//       success: true,
//       message: `${type} file uploaded successfully`,
//       cloudinaryUrl: result.secure_url,
//       data: record,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
