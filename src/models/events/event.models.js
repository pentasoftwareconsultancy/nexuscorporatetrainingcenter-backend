import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  date: { type: DataTypes.DATE },
  location: { type: DataTypes.STRING },
});

export const EventImage = sequelize.define("EventImage", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: { type: DataTypes.STRING, allowNull: false },
  caption: { type: DataTypes.STRING },
  eventId: { type: DataTypes.INTEGER },
});
