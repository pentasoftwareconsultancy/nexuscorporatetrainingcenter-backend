import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const TestCategory = sequelize.define("TestCategory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
});

export const Test = sequelize.define("Test", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  total_questions: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export const Question = sequelize.define("Question", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  question_text: { type: DataTypes.TEXT, allowNull: false },
});

export const Option = sequelize.define("Option", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  option_text: { type: DataTypes.STRING, allowNull: false },
  is_correct: { type: DataTypes.BOOLEAN, defaultValue: false },
});

export const UserTest = sequelize.define("UserTest", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: true },
  attempt_number: { type: DataTypes.INTEGER, defaultValue: 1 },
  total_questions: { type: DataTypes.INTEGER },
  attempted: { type: DataTypes.INTEGER },
  correct_answers: { type: DataTypes.INTEGER },
  score: { type: DataTypes.FLOAT },
});

export const UserAnswer = sequelize.define("UserAnswer", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  optionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  is_correct: { type: DataTypes.BOOLEAN, defaultValue: false },
});
