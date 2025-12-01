import express from "express";

import {
  createPlacement,
  getAllPlacements,
  getBasicPlacements,
  getMinimalPlacements,
  getPlacementStats,
  getPlacementById,
  updatePlacement,
  deletePlacement
} from "../../controllers/comman/placement.controller.js";

import { pagination } from "../../middlewares/pagination.js";
import { cache, cacheStore } from "../../utils/cache.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ------------ CLEAR PLACEMENT CACHE ------------ */
const clearPlacementCache = (req, res, next) => {
  cacheStore.del("placements_all");
  cacheStore.del("placements_basic");
  cacheStore.del("placements_minimal");
  cacheStore.del("placements_stats");
  next();
};

/* ------------ CREATE ------------ */
router.post(
  "/",
  protect,
  clearPlacementCache,
  createPlacement
);

/* ------------ GET (ALL + PAGINATION) ------------ */
router.get(
  "/",
  pagination,
  cache("placements_all"),
  getAllPlacements
);

/* ------------ BASIC LIST ------------ */
router.get(
  "/basic",
  pagination,
  cache("placements_basic"),
  getBasicPlacements
);

/* ------------ MINIMAL LIST (NAME + COMPANY ONLY) ------------ */
router.get(
  "/minimal",
  cache("placements_minimal"),
  getMinimalPlacements
);

/* ------------ STATS (COUNTS) ------------ */
router.get(
  "/stats",
  cache("placements_stats"),
  getPlacementStats
);

/* ------------ GET BY ID ------------ */
router.get("/:id", getPlacementById);

/* ------------ UPDATE ------------ */
router.put(
  "/:id",
  protect,
  clearPlacementCache,
  updatePlacement
);

/* ------------ DELETE ------------ */
router.delete(
  "/:id",
  protect,
  clearPlacementCache,
  deletePlacement
);

export default router;
