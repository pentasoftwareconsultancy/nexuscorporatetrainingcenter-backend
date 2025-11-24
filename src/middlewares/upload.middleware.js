// import multer from "multer";

// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: { fileSize: 200 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     console.log(" Incoming mimetype:", file.mimetype);
//     if (
//       file.mimetype.startsWith("image/") ||
//       file.mimetype.startsWith("video/")
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image and video files are allowed"), false);
//     }
//   },
// });

// export default upload;
