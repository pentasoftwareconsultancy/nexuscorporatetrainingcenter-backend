import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const Video = sequelize.define(
  "Video",
  {
    video_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    caption: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    about: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "videos",
    timestamps: true,
  }
);

export default Video;
