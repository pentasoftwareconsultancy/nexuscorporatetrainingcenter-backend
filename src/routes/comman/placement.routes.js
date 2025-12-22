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
  getCategoryYearWisePlacements,
  getFullPlacementById,
  deletePlacementDetails
} from "../../controllers/comman/placement.controller.js";


const upload = multer({ dest: "uploads/" });

import { pagination } from "../../middlewares/pagination.js";
import { protect, adminOnly } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ---------------- CATEGORY ---------------- */
router.post("/category", protect, adminOnly, createCategory); //done
router.get("/category", getAllCategories); //done
router.put("/category/:id", protect, adminOnly, updateCategory); //done
router.delete("/category/:id", protect, adminOnly, deleteCategory); //done

/* ---------------- PLACEMENTS ---------------- */
router.post("/", protect,  adminOnly, upload.single("file"), createPlacement);
router.get("/", getAllPlacements);
router.get("/:id", getPlacementById);
router.put("/:id", protect, adminOnly, upload.single("file"), updatePlacement);
router.delete("/:id", protect, deletePlacement);
router.get(
  "/reports/category-year-wise",
  getCategoryYearWisePlacements
);

/* ---------------- DETAILS ---------------- */
router.get("/details/all", getAllPlacementDetails); 
router.get("/details/:id", getPlacementDetails); //done
router.post("/details", protect, adminOnly, createPlacementDetails); //done
router.put("/details/:id", protect, adminOnly, updatePlacementDetails); //done
router.get("/full/:placementId", getFullPlacementById);
router.delete("/details/:id", protect, deletePlacementDetails);

/* ---------------- YEAR-WISE ---------------- */
router.get("/reports/year-wise", getPlacementYearWise); //done

export default router;
