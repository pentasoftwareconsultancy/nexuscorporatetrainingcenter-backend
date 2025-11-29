// import express from "express";
// import { submitQuizAttempt, getAttemptResult, getAttemptsForStudent } from "../controllers/quiz_attempt.controller.js";
// import { protect } from "../middlewares/auth.middleware.js";

// const router = express.Router();

// // Submit attempt: public so guests (type 10) can submit; controller enforces login for type 20/30
// router.post("/:quiz_id/submit", submitQuizAttempt);

// // Get attempt result (protected for privacy)
// router.get("/result/:attempt_id", protect, getAttemptResult);

// // Get attempts for a student (protected)
// router.get("/:quiz_id/student/:student_id", protect, getAttemptsForStudent);

// export default router;



import express from "express";
import {
  submitAttempt,
  getAttempts,
  getSingleAttempt,
} from "../controllers/quiz_attempt.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Submit attempt
router.post("/:quiz_id/submit", protect, submitAttempt);

// Get all attempts of student
router.get("/:quiz_id/student/:student_id", protect, getAttempts);

// Get single attempt
router.get("/attempt/:attempt_id", protect, getSingleAttempt);

export default router;



