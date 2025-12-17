import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

/* ================= CITY ================= */
export const City = sequelize.define("City", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

/* ================= COLLEGE ================= */

export const College = sequelize.define("College", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  cityId: { type: DataTypes.INTEGER, allowNull: false },
});

/* ================= MEDIA (IMAGES) ================= */
export const Media = sequelize.define("Media", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  url: { type: DataTypes.STRING, allowNull: false },
  caption: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  collegeId: { type: DataTypes.INTEGER, allowNull: false },
});
