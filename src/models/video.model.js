import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Video = sequelize.define("Video", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: DataTypes.STRING,
  url: DataTypes.STRING,
});
