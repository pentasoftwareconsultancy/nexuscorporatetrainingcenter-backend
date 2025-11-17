 import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Batch = sequelize.define('Batch', {
    batch_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    batch_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    course_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'batches',
    timestamps: false,
  });

  export default Batch;