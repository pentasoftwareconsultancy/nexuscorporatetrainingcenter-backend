// import Quiz from "../models/quiz.model.js";
// import QuizQuestion from "../models/quiz_question.model.js";

// // Create quiz (admin/teacher)
// export const createQuiz = async (req, res) => {
//   try {
//     const { title, course_id, exam_type, duration_seconds } = req.body;
//     const quiz = await Quiz.create({ title, course_id, exam_type, duration_seconds });
//     res.json({ message: "Quiz created", quiz });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get all quizzes (optionally by course)
// export const getAllQuizzes = async (req, res) => {
//   try {
//     const where = {};
//     if (req.query.course_id) where.course_id = req.query.course_id;
//     const quizzes = await Quiz.findAll({ where, order: [["createdAt", "DESC"]] });
//     res.json(quizzes);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get quiz by id with questions for students (hide correct_option)
// export const getQuizById = async (req, res) => {
//   try {
//     const quiz = await Quiz.findByPk(req.params.quiz_id);
//     if (!quiz) return res.status(404).json({ error: "Quiz not found" });

//     const questions = await QuizQuestion.findAll({
//       where: { quiz_id: quiz.quiz_id },
//       attributes: { exclude: ["correct_option", "explanation", "createdAt", "updatedAt"] }
//     });

//     res.json({ quiz, questions });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


import Quiz from "../models/quiz.model.js";
import QuizQuestion from "../models/quiz_question.model.js";
import QuizAttempt from "../models/quiz_attempt.model.js";

export const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.json({ message: "Quiz created", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addQuestion = async (req, res) => {
  try {
    const question = await QuizQuestion.create({
      ...req.body,
      quiz_id: req.params.quiz_id
    });

    res.json({ message: "Question added", question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuizWithQuestions = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.quiz_id, {
      include: [{ model: QuizQuestion }]
    });

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // [{question_id, selected_option}]
    const quiz_id = req.params.quiz_id;
    const student_id = req.user.id;

    const questions = await QuizQuestion.findAll({ where: { quiz_id } });

    let score = 0;
    const total = questions.length;

    const evaluated = answers.map(a => {
      const q = questions.find(q => q.question_id === a.question_id);
      const correct = q.correct_option;
      if (a.selected_option === correct) score++;

      return {
        question_id: a.question_id,
        selected: a.selected_option,
        correct
      };
    });

    const attempt = await QuizAttempt.create({
      student_id,
      quiz_id,
      score,
      total,
      status: score >= total / 2 ? "PASS" : "FAIL",
      answers: evaluated
    });

    res.json({
      message: "Quiz Submitted",
      score,
      total,
      attempt
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getQuizResults = async (req, res) => {
  try {
    const { quiz_id, student_id } = req.params;

    const attempt = await QuizAttempt.findOne({
      where: { quiz_id, student_id }
    });

    if (!attempt) return res.status(404).json({ error: "No result found" });

    res.json(attempt);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
