import express from "express";
import multer from "multer";
import {
  createVideo,
  getAllVideos,
  updateVideo,
  deleteVideo
} from "../../controllers/uploads/video.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/videos",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("photo"), createVideo);     // CREATE
router.get("/", getAllVideos);                             // GET ALL
router.put("/:id", upload.single("photo"), updateVideo);   // UPDATE
router.delete("/:id", deleteVideo);                        // DELETE

export default router;
