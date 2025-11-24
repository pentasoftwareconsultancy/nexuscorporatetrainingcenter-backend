import masterService from "../../services/master/master.service.js";

const masterController = {
  // =============================== COURSES ===============================
  createCourse: async (req, res) => {
    try {
      const data = await masterService.createCourse(req.body, req.user.id);
      res.json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getAllCourses: async (req, res) => {
    try {
      const data = await masterService.getAllCourses(req.limit, req.offset);
      res.json({ success: true, page: req.page, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getCourseById: async (req, res) => {
    try {
      const data = await masterService.getCourseById(req.params.id);
      res.json({ success: true, data });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  updateCourse: async (req, res) => {
    try {
      const data = await masterService.updateCourse(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteCourse: async (req, res) => {
    try {
      await masterService.deleteCourse(req.params.id);
      res.json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // =============================== BATCHES ===============================
  createBatch: async (req, res) => {
    try {
      const data = await masterService.createBatch(req.body);
      res.json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getAllBatches: async (req, res) => {
    try {
      const data = await masterService.getAllBatches(req.limit, req.offset);
      res.json({ success: true, page: req.page, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getBatchById: async (req, res) => {
    try {
      const data = await masterService.getBatchById(req.params.id);
      res.json({ success: true, data });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  },

  updateBatch: async (req, res) => {
    try {
      const data = await masterService.updateBatch(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteBatch: async (req, res) => {
    try {
      await masterService.deleteBatch(req.params.id);
      res.json({ success: true, message: "Batch deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

export default masterController;
