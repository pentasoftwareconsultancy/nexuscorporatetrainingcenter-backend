// import { DataTypes } from "sequelize";
// import { sequelize } from "../config/db.js";

// const QuizQuestion = sequelize.define("QuizQuestion", {
//   quiz_question_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//   quiz_id: { type: DataTypes.INTEGER, allowNull: false },
//   question: { type: DataTypes.TEXT, allowNull: false },
//   option_1: DataTypes.STRING,
//   option_2: DataTypes.STRING,
//   option_3: DataTypes.STRING,
//   option_4: DataTypes.STRING,
//   correct_option: { type: DataTypes.INTEGER, allowNull: false }, // 1..4
//   explanation: DataTypes.TEXT
// }, {
//   tableName: "quiz_questions",
//   timestamps: true
// });

// export default QuizQuestion;


import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Quiz from "./quiz.model.js";

const QuizQuestion = sequelize.define("QuizQuestion", {
  question_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  question: DataTypes.TEXT,
  option_1: DataTypes.STRING,
  option_2: DataTypes.STRING,
  option_3: DataTypes.STRING,
  option_4: DataTypes.STRING,
  correct_option: DataTypes.INTEGER,
  explanation: DataTypes.TEXT
}, {
  tableName: "quiz_questions",
  timestamps: false
});

Quiz.hasMany(QuizQuestion, { foreignKey: "quiz_id" });
QuizQuestion.belongsTo(Quiz, { foreignKey: "quiz_id" });

export default QuizQuestion;
