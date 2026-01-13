// src/modules/certification/certification.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const Certification = sequelize.define(
  "Certification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    averageScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },

    eligibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "certifications",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "categoryId"],
      },
    ],
  }
);

export default Certification;
