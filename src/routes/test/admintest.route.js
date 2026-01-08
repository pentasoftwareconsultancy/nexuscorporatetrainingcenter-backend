import express from "express";
import adminTestController from "../../controllers/test/admintest.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// CATEGORY + TEST
router.get("/categories-tests", protect, adminTestController.getCategoriesWithTests);
router.post("/category-test", protect, adminTestController.createCategoryWithTest);
router.put("/category-test/:testId", protect, adminTestController.updateCategoryWithTest);
router.delete("/test/:id", protect, adminTestController.deleteTest);
router.delete("/category/:id", protect, adminTestController.deleteCategory);

// QUESTIONS + OPTIONS
router.get("/test/:testId/questions", protect, adminTestController.getQuestionsByTest);
router.post("/question", protect, adminTestController.createQuestionWithOptions);
router.put("/question/:id", protect, adminTestController.updateQuestionWithOptions);
router.delete("/question", protect, adminTestController.deleteQuestion);

export default router;
