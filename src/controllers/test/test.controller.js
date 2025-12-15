import testService from "../../services/test/test.service.js";

const testController = {
  createCategory: async (req, res) => {
    try {
      const data = await testService.createCategory(req.body);
      res.json({ success: true, data });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  getCategories: async (req, res) => {
    try {
      const data = await testService.getCategories();
      res.json({ success: true, data });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  createTest: async (req, res) => {
    try {
      const data = await testService.createTest(req.body);
      res.json({ success: true, data });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  getTests: async (req, res) => {
    try {
      const data = await testService.getTests();
      res.json({ success: true, data });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  updateTest: async (req, res) => {
    try {
      const data = await testService.updateTest(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  deleteTest: async (req, res) => {
    try {
      const data = await testService.deleteTest(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  getTestById: async (req, res) => {
    try {
      const data = await testService.getTestById(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  createQuestion: async (req, res) => {
    try {
      const data = await testService.createQuestion(req.body);
      res.json({ success: true, data });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  getQuestion: async (req, res) => {
    try {
      const data = await testService.getQuestion(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  addOption: async (req, res) => {
    try {
      const data = await testService.addOption(req.body);
      res.json({ success: true, data });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  submitTest: async (req, res) => {
    try {
      const data = await testService.submitTest(req.user.id, req.body);
      res.json({ success: true, data });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  getLatestAttempt: async (req, res) => {
    try {
      const { testId } = req.params; // /latest/:testId
      console.log("testId:", testId);
      const userId = req.user.id;
      console.log("userId:", userId);

      const data = await testService.getLatestAttempt(userId, testId);

      if (!data) {
        return res
          .status(404)
          .json({ success: false, message: "No attempts found" });
      }

      res.json({ success: true, data });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  },

  getUserTestSummary: async (req, res) => {
    try {
      const { userTestId } = req.params;
    
      const userTest = await UserTest.findOne({
        where: { id: userTestId },
        include: [
          {
            model: UserAnswer,
            include: [
              {
                model: Option,
                attributes: ["id", "option_text", "is_correct"]
              },
              {
                model: Question,
                attributes: ["id", "question_text", "answer_explanation"],
                include: [
                  {
                    model: Option,
                    attributes: ["id", "option_text", "is_correct"]
                  }
                ]
              }
            ]
          }
        ],
        order: [[UserAnswer, "questionId", "ASC"]],
      });
    
      if (!userTest) {
        return res.status(404).json({ message: "User Test not found" });
      }
    
      // Transform the data into a clean response
      const summary = {
        userTestId: userTest.id,
        total_questions: userTest.total_questions,
        correct_answers: userTest.correct_answers,
        score: userTest.score,
        questions: userTest.UserAnswers.map((ua) => ({
          questionId: ua.Question.id,
          question_text: ua.Question.question_text,
          answer_explanation: ua.Question.answer_explanation,
        
          options: ua.Question.Options.map((opt) => ({
            id: opt.id,
            text: opt.option_text,
            is_correct: opt.is_correct === 1
          })),
        
          user_answer_option_id: ua.optionId,
          user_is_correct: ua.is_correct === 1
        }))
      };
    
      return res.json(summary);
    
    } catch (err) {
      console.error("Get Test Summary Error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default testController;
