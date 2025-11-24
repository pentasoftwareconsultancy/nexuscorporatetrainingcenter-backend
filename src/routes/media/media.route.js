import express from "express";
import multer from "multer";
import { protect } from "../../middlewares/auth.middleware.js";
import mediaController from "../../controllers/media/media.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// GALLERY
router.post("/gallery", protect, mediaController.createGallery);
router.get("/gallery", mediaController.getAllGalleries);
router.get("/gallery/:id", mediaController.getGalleryById);

// MEDIA
router.post(
  "/upload",
  protect,
  upload.single("file"),
  mediaController.uploadMedia
);
router.delete("/:id", protect, mediaController.deleteMedia);

export default router;
