import { Course, Batch } from "../../models/master/master.models.js";

const masterService = {
  // =============================== COURSES ===============================
  createCourse: async (body, userId) => {
    return await Course.create({ ...body, createdBy: userId });
  },

  getAllCourses: async (limit, offset) => {
    return await Course.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  },

  getCourseById: async (id) => {
    const course = await Course.findByPk(id);
    if (!course) throw new Error("Course not found");
    return course;
  },

  updateCourse: async (id, body) => {
    const course = await Course.findByPk(id);
    if (!course) throw new Error("Course not found");
    return await course.update(body);
  },

  deleteCourse: async (id) => {
    const course = await Course.findByPk(id);
    if (!course) throw new Error("Course not found");
    return await course.destroy();
  },

  // =============================== BATCHES ===============================
  createBatch: async (body) => {
    return await Batch.create(body);
  },

  getAllBatches: async (limit, offset) => {
    return await Batch.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  },

  getBatchById: async (id) => {
    const batch = await Batch.findByPk(id);
    if (!batch) throw new Error("Batch not found");
    return batch;
  },

  updateBatch: async (id, body) => {
    const batch = await Batch.findByPk(id);
    if (!batch) throw new Error("Batch not found");
    return await batch.update(body);
  },

  deleteBatch: async (id) => {
    const batch = await Batch.findByPk(id);
    if (!batch) throw new Error("Batch not found");
    return await batch.destroy();
  },
};

export default masterService;
