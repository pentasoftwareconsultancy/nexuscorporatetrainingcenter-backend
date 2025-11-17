import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Category from "./category.model.js"

const Course = sequelize.define("Course", {
 
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: DataTypes.TEXT,
  instructor_name: DataTypes.STRING,
  duration: DataTypes.STRING,
  fees: DataTypes.DECIMAL(10, 2),
  contact: DataTypes.STRING,
  what_you_learn: DataTypes.JSON,
  syllabus: DataTypes.TEXT,
  image_url: DataTypes.STRING,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
 {
  tableName: 'course',
  timestamps: false,
},
);

  
export default Course;

