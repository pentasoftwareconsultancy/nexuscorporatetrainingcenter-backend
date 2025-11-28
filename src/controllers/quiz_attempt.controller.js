import QuizAttempt from "../models/quiz_attempt.model.js";
import QuizQuestion from "../models/quiz_question.model.js";

// ============================
// Submit Quiz Attempt
// ============================
export const submitAttempt = async (req, res) => {
  try {
    const { answers } = req.body; 
    const quiz_id = req.params.quiz_id;
    const student_id = req.user?.id || null; // for guest users

    // Fetch all questions of this quiz
    const questions = await QuizQuestion.findAll({
      where: { quiz_id }
    });

    if (!questions || questions.length === 0) {
      return res.status(404).json({ error: "No questions found for this quiz" });
    }

    let score = 0;
    const total = questions.length;

    const checkedAnswers = answers.map((ans) => {
      const q = questions.find(
        (item) =>
          item.quiz_question_id === ans.quiz_question_id ||
          item.quiz_question_id === ans.question_id
      );

      if (!q) {
        return {
          question_id: ans.quiz_question_id,
          selected: ans.selected_option,
          correct: null
        };
      }

      const isCorrect = q.correct_option === ans.selected_option;
      if (isCorrect) score++;

      return {
        question_id: q.quiz_question_id,
        selected: ans.selected_option,
        correct: q.correct_option
      };
    });

    const attempt = await QuizAttempt.create({
      quiz_id,
      student_id,
      score,
      total,
      status: score >= total / 2 ? "PASS" : "FAIL",
      answers: checkedAnswers
    });

    return res.json({
      message: "Quiz submitted successfully",
      attempt,
      score,
      total
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ============================
// Get All Attempts
// ============================
export const getAttempts = async (req, res) => {
  try {
    const { quiz_id, student_id } = req.params;

    const attempts = await QuizAttempt.findAll({
      where: { quiz_id, student_id }
    });

    return res.json(attempts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ============================
// Get Single Attempt
// ============================
export const getSingleAttempt = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findByPk(req.params.attempt_id);

    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }

    return res.json(attempt);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
