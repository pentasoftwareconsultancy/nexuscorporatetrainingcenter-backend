import express from "express";
import multer from "multer";

import {
  createFaculty,
  getAllFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty
} from "../../controllers/faculty/faculty.controller.js";

import { protect, adminOnly } from "../../middlewares/auth.middleware.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

/* ADMIN PROTECTED ROUTES */
router.post("/", protect, adminOnly, upload.single("file"), createFaculty);
router.put("/:id", protect, adminOnly, upload.single("file"), updateFaculty);
router.delete("/:id", protect, adminOnly, deleteFaculty);

/* PUBLIC ROUTES */
router.get("/", getAllFaculty);
router.get("/:id", getFacultyById);

export default router;

