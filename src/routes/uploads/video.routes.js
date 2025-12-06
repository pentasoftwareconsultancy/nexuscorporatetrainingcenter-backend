import express from "express";
import multer from "multer";
import { protect } from "../../middlewares/auth.middleware.js";
import videoController from "../../controllers/uploads/video.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* ===================== VIDEOS ===================== */

// CREATE VIDEO
router.post(
  "/video",
  upload.single("file"),  // must match Postman key
  videoController.createVideo
);

// GET ALL VIDEOS
router.get("/video", videoController.getAllVideos);

// UPDATE VIDEO
router.put(
  "/video/:id",
  protect,
  upload.single("file"),
  videoController.updateVideo
);

// DELETE VIDEO
router.delete("/video/:id", protect, videoController.deleteVideo);

export default router;
