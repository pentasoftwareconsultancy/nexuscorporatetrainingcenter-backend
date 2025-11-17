import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define("User", {
  emailOrPhone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "student", "teacher"),
    defaultValue: "student",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default User;
