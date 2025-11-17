import express from "express";
import { createCourse, deleteCourse, getActiveCourses, getAllCourses, getCourseById, getCoursesByCategory, updateCourse } from "../controllers/course.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizRole } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllCourses) //done
router.get('/active', getActiveCourses); //
router.get("/:course_id", getCourseById) //done
router.get('/category/:category_id', getCoursesByCategory);//

// add admin protection
router.use(protect, authorizRole("admin"));
router.post("/", createCourse);//done
router.put('/:course_id', updateCourse); //done
router.delete('/:course_id', deleteCourse);
export default router;