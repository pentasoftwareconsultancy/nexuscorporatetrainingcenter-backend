// src/modules/certification/certification.routes.js
import express from "express";
import { getMyCertifications } from "../../controllers/certification/certification.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * User certifications (JWT required)
 */
router.get("/me", protect, getMyCertifications);

export default router;
