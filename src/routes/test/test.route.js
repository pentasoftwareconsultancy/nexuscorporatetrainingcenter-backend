import express from "express";
import testController from "../../controllers/test/test.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// CATEGORY
router.post("/category", protect, testController.createCategory);
router.get("/category", testController.getCategories);

// TEST
router.post("/", protect, testController.createTest);
router.get("/", testController.getTests);
router.get("/:id", testController.getTestById);
router.put("/:id", protect, testController.updateTest);
router.delete("/:id", protect, testController.deleteTest);

// QUESTION
router.post("/question", protect, testController.createQuestion);
router.get("/question/:id", testController.getQuestion);

// OPTIONS
router.post("/option", protect, testController.addOption);
router.get("/option/:id", testController.getOption);

// SUBMIT TEST
router.post("/submit", protect, testController.submitTest);

// router.get("/tests/:id", testController.getTestById);

export default router;
