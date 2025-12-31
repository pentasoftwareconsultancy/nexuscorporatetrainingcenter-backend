import express from "express";
import multer from "multer";
import reviewController from "../../controllers/reviews/review.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { pagination } from "../../middlewares/pagination.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* PUBLIC */
router.get("/", pagination, reviewController.getAll);

/* ADMIN ONLY */
router.get("/byid/:id", protect, reviewController.gitById);
router.post("/", protect, upload.array("file", 1), reviewController.create);
router.put("/:id", protect, upload.array("file", 1), reviewController.update);
router.delete("/:id", protect, reviewController.remove);

export default router;
