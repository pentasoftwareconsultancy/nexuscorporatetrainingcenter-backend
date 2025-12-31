import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const City = sequelize.define("City", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

export const College = sequelize.define("College", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  cityId: { type: DataTypes.INTEGER, allowNull: false },
});

export const Media = sequelize.define("Media", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  url: { type: DataTypes.STRING, allowNull: false },
  caption: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  collegeId: { type: DataTypes.INTEGER, allowNull: false },
});
