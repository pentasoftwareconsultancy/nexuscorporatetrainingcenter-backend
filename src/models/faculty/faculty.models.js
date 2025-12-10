import { DataTypes } from "sequelize";
import {sequelize} from "../../config/db.js";

const Faculty = sequelize.define(
  "Faculty",
  {
    facultyId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    faculty_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cloudinaryId: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    tableName: "faculty",
    timestamps: true,
  }
);

export default Faculty;
