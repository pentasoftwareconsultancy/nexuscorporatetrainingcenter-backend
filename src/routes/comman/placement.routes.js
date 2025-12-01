import express from "express";
import {
  createPlacement,
  getAllPlacements,
  getPlacementById,
  updatePlacement,
  deletePlacement,
  getBasicPlacements
} from "../../controllers/comman/placement.controller.js";

const router = express.Router();

router.post("/", createPlacement);
router.get("/", getAllPlacements);
router.get("/basic", getBasicPlacements);
router.get("/:id", getPlacementById);
router.put("/:id", updatePlacement);
router.delete("/:id", deletePlacement);



export default router;
