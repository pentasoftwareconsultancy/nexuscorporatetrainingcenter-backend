import masterService from "../../services/master/master.service.js";

const masterController = {
  createCourseCategory: async (req, res) => {
    try {
      const data = await masterService.createCourseCategory(req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getAllCourseCategories: async (req, res) => {
    try {
      const data = await masterService.getAllCourseCategories();
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getCourseCategoryById: async (req, res) => {
    try {
      const data = await masterService.getCourseCategoryById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  updateCourseCategory: async (req, res) => {
    try {
      const data = await masterService.updateCourseCategory(
        req.params.id,
        req.body
      );
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteCourseCategory: async (req, res) => {
    try {
      await masterService.deleteCourseCategory(req.params.id);
      res.json({ success: true, message: "Category deleted" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

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

  createCourseWithDetails: async (req, res) => {
    try {
      const data = await masterService.createCourseWithDetails(
        req.body,
        req.file,
        req.user.id
      );
    
      res.status(201).json({
        success: true,
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  // =========================== COURSE DETAILS ============================
   getCategoryWithCourses: async (req, res) => {
    try {
      const { categoryId } = req.params;
    
      const data = await masterService.getCategoryWithCoursesAndDetails(categoryId);
    
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }
    
      res.json({ success: true, data });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },
  /* ================= CREATE ================= */
  createCourseDetails: async (req, res) => {
    try {
      const data = await masterService.createCourseDetails(req.body, req.file);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  /* ================= READ ================= */
  getCourseDetails: async (req, res) => {
    try {
      const data = await masterService.getCourseDetailsByCourseId(
        req.params.courseId
      );
      res.json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  /* ================= UPDATE ================= */
  updateCourseDetails: async (req, res) => {
    try {
      const data = await masterService.updateCourseDetails(
        req.params.courseId,
        req.body,
        req.file
      );
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  /* ================= DELETE ================= */
  deleteCourseDetails: async (req, res) => {
    try {
      await masterService.deleteCourseDetails(req.params.courseId);
      res.json({ success: true, message: "Course details deleted" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  // =============================== BATCHES ===============================
  createBatch: async (req, res) => {
    console.log("BODY RECEIVED:", req.body); // <-- ADD THIS
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
