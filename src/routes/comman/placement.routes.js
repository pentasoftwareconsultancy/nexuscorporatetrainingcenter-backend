import express from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  createPlacement,
  getAllPlacements,
  getPlacementById,
  updatePlacement,
  deletePlacement,
  createPlacementDetails,
  updatePlacementDetails,
  getPlacementDetails,
  getPlacementYearWise,
  getAllPlacementDetails,
} from "../../controllers/comman/placement.controller.js";

import { pagination } from "../../middlewares/pagination.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ---------------- CATEGORY ---------------- */
router.post("/category", protect, createCategory); //done
router.get("/category", getAllCategories); //done
router.put("/category/:id", protect, updateCategory); //done
router.delete("/category/:id", protect, deleteCategory); //done

/* ---------------- PLACEMENTS ---------------- */
router.post("/", protect, createPlacement); //done
router.get("/", pagination, getAllPlacements); //done
router.get("/:id", getPlacementById); //done
router.put("/:id", protect, updatePlacement); //done
router.delete("/:id", protect, deletePlacement); //done

/* ---------------- DETAILS ---------------- */
router.get("/details/all", getAllPlacementDetails); 
router.get("/details/:id", getPlacementDetails); //done
router.post("/details", protect, createPlacementDetails); //done
router.put("/details/:id", protect, updatePlacementDetails); //done

/* ---------------- YEAR-WISE ---------------- */
router.get("/reports/year-wise", getPlacementYearWise); //done

export default router;
