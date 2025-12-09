import express from "express";
import multer from "multer";
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


const upload = multer({ dest: "uploads/" });

import { pagination } from "../../middlewares/pagination.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ---------------- CATEGORY ---------------- */
router.post("/category", protect, createCategory); //done
router.get("/category", getAllCategories); //done
router.put("/category/:id", protect, updateCategory); //done
router.delete("/category/:id", protect, deleteCategory); //done

/* ---------------- PLACEMENTS ---------------- */
router.post("/", protect, upload.single("file"), createPlacement);
router.get("/", getAllPlacements);
router.get("/:id", getPlacementById);
router.put("/:id", protect, upload.single("file"), updatePlacement);
router.delete("/:id", protect, deletePlacement);

/* ---------------- DETAILS ---------------- */
router.get("/details/all", getAllPlacementDetails); 
router.get("/details/:id", getPlacementDetails); //done
router.post("/details", protect, createPlacementDetails); //done
router.put("/details/:id", protect, updatePlacementDetails); //done

/* ---------------- YEAR-WISE ---------------- */
router.get("/reports/year-wise", getPlacementYearWise); //done

export default router;
