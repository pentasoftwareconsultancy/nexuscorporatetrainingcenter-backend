import express from "express";

import { pagination } from "../../middlewares/pagination.js";
import { cache, cacheStore } from "../../utils/cache.js";
import masterController from "../../controllers/master/master.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ---------------- COURSE CATEGORY ---------------- */

router.post("/course-category", protect, masterController.createCourseCategory);

router.get("/course-category", masterController.getAllCourseCategories);

router.get("/course-category/:id", masterController.getCourseCategoryById);

router.put(
  "/course-category/:id",
  protect,
  masterController.updateCourseCategory
);

router.delete(
  "/course-category/:id",
  protect,
  masterController.deleteCourseCategory
);

/* ---------------- CLEAR COURSE CACHE ---------------- */
const clearCoursesCache = (req, res, next) => { cacheStore.del("courses"); next(); };

/* --------------------- COURSES --------------------- */

router.post( "/courses", protect, clearCoursesCache, masterController.createCourse ); // Clear cache

router.get( "/courses", pagination, cache("courses"), masterController.getAllCourses ); // Clear cache

router.get("/courses/:id", masterController.getCourseById);

router.put( "/courses/:id", protect, clearCoursesCache, masterController.updateCourse ); // Clear cache

router.delete( "/courses/:id", protect, clearCoursesCache, masterController.deleteCourse ); // Clear cache

/* ---------------- COURSE DETAILS ---------------- */

router.post(
  "/course-details",
  protect,
  clearCoursesCache,
  masterController.createCourseDetails
);

router.get(
  "/course-details/:courseId",
  masterController.getCourseDetails
);

router.put(
  "/course-details/:courseId",
  protect,
  masterController.updateCourseDetails
);

router.delete(
  "/course-details/:courseId",
  protect,
  masterController.deleteCourseDetails
);

/* --------------------- BATCHES --------------------- */

router.post("/batches", protect, masterController.createBatch);

router.get("/batches", pagination, masterController.getAllBatches);

router.get("/batches/:id", masterController.getBatchById);

router.put("/batches/:id", protect, masterController.updateBatch);

router.delete("/batches/:id", protect, masterController.deleteBatch);

export default router;
