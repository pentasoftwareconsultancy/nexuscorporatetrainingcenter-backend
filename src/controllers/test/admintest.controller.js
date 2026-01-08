import adminTestService from "../../services/test/admintest.service.js";

const adminTestController = {
  createCategoryWithTest: async (req, res) => {
    try {
      const data = await adminTestService.createCategoryWithTest(req.body);
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getCategoriesWithTests: async (req, res) => {
    try {
      const data = await adminTestService.getCategoriesWithTests();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  createQuestionWithOptions: async (req, res) => {
    try {
      const data = await adminTestService.createQuestionWithOptions(req.body);
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getQuestionsByTest: async (req, res) => {
    try {
      const data = await adminTestService.getQuestionsByTest(req.params.testId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateQuestionWithOptions: async (req, res) => {
    try {
      await adminTestService.updateQuestionWithOptions(req.params.id, req.body);
      res.json({ message: "Question updated successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteQuestion: async (req, res) => {
    try {
      const { questionId, testId } = req.body;
      await adminTestService.deleteQuestion(questionId, testId);
      res.json({ message: "Question deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteTest: async (req, res) => {
    try {
      await adminTestService.deleteTest(req.params.id);
      res.json({ message: "Test deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      await adminTestService.deleteCategory(req.params.id);
      res.json({ message: "Category deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateCategoryWithTest: async (req, res) => {
    try {
      await adminTestService.updateCategoryWithTest(
        req.params.testId,
        req.body
      );
      res.json({ message: "Category & Test updated successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

export default adminTestController;
