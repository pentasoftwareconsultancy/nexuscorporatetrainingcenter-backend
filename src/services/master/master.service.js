import {
  Course,
  Batch,
  CourseDetails,
  CourseCategory,
} from "../../models/master/master.models.js";
import { uploadPDFToCloudinary } from "../../utils/cloudinaryUpload.js";

const masterService = {
  // ------------------ COURSE CATEGORY ------------------
  createCourseCategory: async (body) => {
    return await CourseCategory.create(body);
  },

  getAllCourseCategories: async () => {
    return await CourseCategory.findAll();
  },

  getCourseCategoryById: async (id) => {
    const cat = await CourseCategory.findByPk(id);
    if (!cat) throw new Error("Category not found");
    return cat;
  },

  updateCourseCategory: async (id, body) => {
    const cat = await CourseCategory.findByPk(id);
    if (!cat) throw new Error("Category not found");
    return await cat.update(body);
  },

  deleteCourseCategory: async (id) => {
    const cat = await CourseCategory.findByPk(id);
    if (!cat) throw new Error("Category not found");
    return await cat.destroy();
  },

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

  // =========================== COURSE DETAILS ============================
  createCourseDetails: async (body, file) => {
    if (!body.courseId) throw new Error("courseId is required");

    // Ensure course exists
    const course = await Course.findByPk(body.courseId);
    if (!course) throw new Error("Course not found");

    let pdfUrl = null;

    if (file) {
      pdfUrl = await uploadPDFToCloudinary(file.path);
    }

    return await CourseDetails.create({
      ...body,
      syllabus_pdf: pdfUrl,
    });
  },

  /* ================= READ ================= */
  getCourseDetailsByCourseId: async (courseId) => {
    const details = await CourseDetails.findOne({ where: { courseId } });

    if (!details) throw new Error("Course details not found");
    return details;
  },

   getCategoryWithCoursesAndDetails: async (categoryId) => {
    return await CourseCategory.findOne({
      where: { id: categoryId },
      include: [
        {
          model: Course,
          as: "courses",
          include: [
            {
              model: CourseDetails,
              as: "details"
            }
          ]
        }
      ]
    });
  },

  /* ================= UPDATE ================= */
  updateCourseDetails: async (courseId, body, file) => {
    const details = await CourseDetails.findOne({ where: { courseId } });

    if (!details) throw new Error("Course details not found");

    let pdfUrl = details.syllabus_pdf;

    if (file) {
      pdfUrl = await uploadPDFToCloudinary(file.path);
    }

    return await details.update({
      ...body,
      syllabus_pdf: pdfUrl,
    });
  },

  /* ================= DELETE ================= */
  deleteCourseDetails: async (courseId) => {
    const details = await CourseDetails.findOne({ where: { courseId } });

    if (!details) throw new Error("Course details not found");

    return await details.destroy();
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
