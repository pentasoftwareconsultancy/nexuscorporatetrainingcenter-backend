// import express from "express";
// import { addQuestionToQuiz, getAllQuestions, updateQuestion, deleteQuestion } from "../controllers/quiz_question.controller.js";
// import { protect } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// // Admin/teacher only routes
// router.get("/:quiz_id", protect, getAllQuestions);
// router.post("/:quiz_id", protect, addQuestionToQuiz);
// router.put("/edit/:question_id", protect, updateQuestion);
// router.delete("/delete/:question_id", protect, deleteQuestion);

// export default router;


import express from "express";
import {
  createQuizQuestion,
  getQuizQuestions,
  updateQuizQuestion,
  deleteQuizQuestion,
} from "../controllers/quiz_question.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all questions in quiz
router.get("/:quiz_id", getQuizQuestions);//done

// Create question
router.post("/:quiz_id", protect, createQuizQuestion);//done

// Update question
router.put("/edit/:question_id", protect, updateQuizQuestion);//done

// Delete question
router.delete("/delete/:question_id", protect, deleteQuizQuestion);//done

export default router;
