import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

/* ================= COURSECATEGORY ================= */

export const CourseCategory = sequelize.define("CourseCategory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

/* ====================== COURSE ===================== */
export const Course = sequelize.define("Course", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  duration: DataTypes.STRING,
  fees: DataTypes.DECIMAL,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  categoryId: {
    // ✅ NEW COLUMN
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

/* ==================== COURSE DETAILS =================== */
export const CourseDetails = sequelize.define("CourseDetails", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  what_you_will_learn: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  syllabus: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  syllabus_pdf: {
    type: DataTypes.STRING, // store filename or full URL
    allowNull: true,
  },

  instructor: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

/* ======================= BATCH ====================== */
export const Batch = sequelize.define("Batch", {
  id: {
    type: DataTypes.INTEGER, // FIXED
    autoIncrement: true,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  start_date: { type: DataTypes.DATE },
  end_date: { type: DataTypes.DATE },
});
