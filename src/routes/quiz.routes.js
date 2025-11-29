// import express from "express";
// import { protect } from "../middlewares/auth.middleware.js";
// import { createQuiz, getAllQuizzes, getQuizById } from "../controllers/quiz.controller.js";

// const router = express.Router();

// router.get("/", getAllQuizzes);            // list quizzes
// router.get("/:quiz_id", getQuizById);     // get quiz + questions (student view)

// // protected create
// router.post("/", protect, createQuiz);

// export default router;


import express from "express";
import {
  createQuiz,
  addQuestion,
  getQuizWithQuestions,
  submitQuiz,
  getQuizResults
} from "../controllers/quiz.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public
router.get("/:quiz_id", getQuizWithQuestions);//done

// Admin/Teacher
router.post("/", protect, createQuiz);//done
router.post("/:quiz_id/questions", protect, addQuestion);//done

// Student actions
router.post("/:quiz_id/submit", protect, submitQuiz);
router.get("/:quiz_id/results/:student_id", protect, getQuizResults);

export default router;
