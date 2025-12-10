import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  emailOrPhone: { type: DataTypes.STRING, allowNull: false, unique: true },

  password: { type: DataTypes.STRING, allowNull: false },

  role: { type: DataTypes.ENUM("admin","user"), defaultValue: "user" },
  

 passwordRecoveryQuestion: {
  type: DataTypes.STRING,
  allowNull: true
},

passwordRecoveryAnswer: {
  type: DataTypes.STRING,
  allowNull: true
},

isAnswerVerified: {
  type: DataTypes.BOOLEAN,
  defaultValue: false
},
}, {
  tableName: "Users",
  timestamps: true

});

export default User;
