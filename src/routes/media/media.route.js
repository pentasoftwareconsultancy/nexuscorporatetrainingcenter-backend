import express from "express";
import multer from "multer";
import mediaController from "../../controllers/media/media.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* CITY */
router.post("/city", mediaController.createCity);
router.get("/city", mediaController.getCities);

/* COLLEGE */
router.post("/college", mediaController.createCollege);
router.get("/college/:cityId", mediaController.getCollegesByCity);
router.get("/college/single/:id", mediaController.getCollegeById);

/* IMAGES (MULTIPLE) */
router.post(
  "/image/upload",
  upload.array("files", 10), // ✅ MULTIPLE FILES
  mediaController.uploadImage
);

router.get("/image/:collegeId", mediaController.getImagesByCollege);

/* ===================== CITY ===================== */
router.put("/city/:id", protect, mediaController.updateCity);
router.delete("/city/:id", protect, mediaController.deleteCity);

/* ===================== COLLEGE ===================== */
router.put("/college/:id", protect, mediaController.updateCollege);
router.delete("/college/:id", protect, mediaController.deleteCollege);

/* ===================== MEDIA ===================== */
router.put("/media/:id", protect, mediaController.updateMedia);
router.delete("/media/:id", protect, mediaController.deleteMedia);

export default router;
