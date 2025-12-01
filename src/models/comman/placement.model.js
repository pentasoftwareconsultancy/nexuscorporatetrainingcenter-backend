import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const Placement = sequelize.define(
  "Placement",
  {
    placement_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isEmail: true },
    },
    mobile_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    placed_in_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company_role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    package: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    story: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "placements",
    timestamps: true,
  }
);

export default Placement;
