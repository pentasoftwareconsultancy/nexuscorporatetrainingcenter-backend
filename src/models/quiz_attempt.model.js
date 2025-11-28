//import { DataTypes } from "sequelize";
// import { sequelize } from "../config/db.js";

// const QuizQuestionAttempt = sequelize.define("QuizQuestionAttempt", {
//   quiz_question_attempt_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//   quiz_attempt_id: { type: DataTypes.INTEGER, allowNull: false },
//   quiz_question_id: { type: DataTypes.INTEGER, allowNull: false },
//   selected_option: { type: DataTypes.INTEGER, allowNull: true },
//   is_correct: { type: DataTypes.BOOLEAN, defaultValue: false }
// }, {
//   tableName: "quiz_question_attempts",
//   timestamps: false
// });

// export default QuizQuestionAttempt;


import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const QuizAttempt = sequelize.define("QuizAttempt", {
  attempt_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id: DataTypes.INTEGER,
  quiz_id: DataTypes.INTEGER,
  score: DataTypes.INTEGER,
  total: DataTypes.INTEGER,
  status: DataTypes.STRING,
  attempt_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  answers: { type: DataTypes.JSON }
}, {
  tableName: "quiz_attempts",
  timestamps: false
});

export default QuizAttempt;
