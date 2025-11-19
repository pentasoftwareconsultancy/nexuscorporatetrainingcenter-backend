// import QuizQuestion from "../models/quiz_question.model.js";
// import Quiz from "../models/quiz.model.js";

// // Add question to quiz (admin)
// export const addQuestionToQuiz = async (req, res) => {
//   try {
//     const { quiz_id } = req.params;
//     const quiz = await Quiz.findByPk(quiz_id);
//     if (!quiz) return res.status(404).json({ error: "Quiz not found" });

//     const q = await QuizQuestion.create({ ...req.body, quiz_id });
//     res.json({ message: "Question added", question: q });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get all questions for a quiz (admin view with answers)
// export const getAllQuestions = async (req, res) => {
//   try {
//     const { quiz_id } = req.params;
//     const questions = await QuizQuestion.findAll({ where: { quiz_id } });
//     res.json(questions);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const updateQuestion = async (req, res) => {
//   try {
//     const q = await QuizQuestion.findByPk(req.params.question_id);
//     if (!q) return res.status(404).json({ error: "Question not found" });
//     await q.update(req.body);
//     res.json({ message: "Question updated", question: q });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const deleteQuestion = async (req, res) => {
//   try {
//     const q = await QuizQuestion.findByPk(req.params.question_id);
//     if (!q) return res.status(404).json({ error: "Question not found" });
//     await q.destroy();
//     res.json({ message: "Question deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


import QuizQuestion from "../models/quiz_question.model.js";

// Create question
export const createQuizQuestion = async (req, res) => {
  try {
    const question = await QuizQuestion.create({
      ...req.body,
      quiz_id: req.params.quiz_id
    });

    res.json({ message: "Question created", question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ALL questions of quiz
export const getQuizQuestions = async (req, res) => {
  try {
    const questions = await QuizQuestion.findAll({
      where: { quiz_id: req.params.quiz_id }
    });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a question
export const updateQuizQuestion = async (req, res) => {
  try {
    const question = await QuizQuestion.findByPk(req.params.question_id);

    if (!question) return res.status(404).json({ error: "Question not found" });

    await question.update(req.body);

    res.json({ message: "Question updated", question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a question
export const deleteQuizQuestion = async (req, res) => {
  try {
    const question = await QuizQuestion.findByPk(req.params.question_id);

    if (!question) return res.status(404).json({ error: "Question not found" });

    await question.destroy();

    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
