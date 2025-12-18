import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    /* USERNAME */
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /* EMAIL OR LOGIN IDENTIFIER */
    emailOrPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    /* PHONE NUMBER */
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /* PASSWORD */
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /* ROLE */
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },

    /* PASSWORD RECOVERY */
    passwordRecoveryQuestion: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    passwordRecoveryAnswer: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isAnswerVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "Users",
    timestamps: true,
  }
);

export default User;
