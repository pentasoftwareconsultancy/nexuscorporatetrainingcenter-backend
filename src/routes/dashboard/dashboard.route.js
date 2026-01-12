import express from "express";
import { dashboardStats, getAllUsers, getNewUsers } from "../../controllers/dashboard/dashboard.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { pagination } from "../../middlewares/pagination.js";

const router = express.Router();

router.get("/admin/dashboard-stats",protect, pagination, dashboardStats);

// All users
router.get("/admin/users", protect, pagination, getAllUsers);

// New users
router.get("/admin/users/new", protect, pagination, getNewUsers);

export default router;