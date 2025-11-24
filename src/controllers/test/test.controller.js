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

  
  getTestById: async (req, res) => {
    try {
      const data = await testService.getTestById(req.params.id);
      res.json({ success: true, data });
    } catch (e) {
      res.status(404).json({ success: false, message: e.message });
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
};

export default testController;
