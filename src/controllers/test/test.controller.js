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
};

export default testController;
