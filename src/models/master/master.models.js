import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

/* ================= COURSECATEGORY ================= */

export const CourseCategory = sequelize.define("CourseCategory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

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
