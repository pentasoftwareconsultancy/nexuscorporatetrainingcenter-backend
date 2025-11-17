import express from 'express';
import { createBatch, deleteBatch, getAllBatches, getBatchById, updateBatch } from '../controllers/batch.controller.js';
import { protect } from "../middlewares/auth.middleware.js";
import { authorizRole } from "../middlewares/roleMiddleware.js";
const router = express.Router();

router.get("/", getAllBatches);
router.get("/:id", getBatchById);

//admin
router.use(protect, authorizRole("admin"));
router.post("/", createBatch);
router.put("/:id", updateBatch);
router.delete("/:id", deleteBatch);

export default router;