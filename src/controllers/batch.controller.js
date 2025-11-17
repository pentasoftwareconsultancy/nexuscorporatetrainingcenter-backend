import Course from "../models/course.model.js";
//import Category from "../models/category.model.js";
import Batch from "../models/batch.model.js";

// ✅ Create a new batch
export const createBatch = async (req, res) => {
  try {
    const { batch_name, course_id, course_name, duration, start_date, fees, contact } = req.body;

    // optional: validate course_id exists
    if (course_id) {
      const course = await Course.findByPk(course_id);
      if (!course) return res.status(404).json({ error: "Course not found" });
    }

    const batch = await Batch.create({
      batch_name,
      course_id: course_id || null,
      course_name,
      duration,
      start_date,
      fees,
      contact,
    });

    res.status(201).json({
      message: "Batch created successfully",
      batch,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all batches
export const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.findAll({
      include: [{ model: Course, as: "course" }],
    });
    res.json(batches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get a single batch by ID
export const getBatchById = async (req, res) => {
  try {
    const batch = await Batch.findByPk(req.params.id, {
      include: [{ model: Course, as: "course" }],
    });
    if (!batch) return res.status(404).json({ error: "Batch not found" });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update a batch
export const updateBatch = async (req, res) => {
  try {
    const batch = await Batch.findByPk(req.params.id);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    const { course_id } = req.body;
    if (course_id) {
      const course = await Course.findByPk(course_id);
      if (!course) return res.status(404).json({ error: "Course not found" });
    }

    await batch.update(req.body);

    res.json({
      message: "Batch updated successfully",
      batch,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a batch
export const deleteBatch = async (req, res) => {
  try {
    const batch = await Batch.findByPk(req.params.id);
    if (!batch) return res.status(404).json({ error: "Batch not found" });

    await batch.destroy();
    res.json({ message: "Batch deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




