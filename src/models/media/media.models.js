import { DataTypes as D2 } from "sequelize";
import { sequelize as _sequelize } from "../../config/db.js";

export const Gallery = _sequelize.define("Gallery", {
  id: {
    type: D2.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: { type: D2.STRING },
});

export const Media = _sequelize.define("Media", {
  id: {
    type: D2.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: { type: D2.STRING, allowNull: false },
  type: { type: D2.ENUM("image", "video"), defaultValue: "image" },
  caption: { type: D2.STRING },

  // FK will be added in associations.js
  galleryId: {
    type: D2.INTEGER,
    allowNull: true,
  },
});
