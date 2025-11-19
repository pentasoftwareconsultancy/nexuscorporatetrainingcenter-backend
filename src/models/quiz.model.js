// import { DataTypes } from "sequelize";
// import { sequelize } from "../config/db.js";

// const Quiz = sequelize.define("Quiz", {
//   quiz_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//   title: { type: DataTypes.STRING, allowNull: false },
//   course_id: { type: DataTypes.INTEGER, allowNull: true },
//   exam_type: { type: DataTypes.INTEGER, defaultValue: 10 }, // 10 | 20 | 30
//   duration_seconds: { type: DataTypes.INTEGER, allowNull: true } // optional duration in seconds
// }, {
//   tableName: "quizzes",
//   timestamps: false
// });

// export default Quiz;



import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Quiz = sequelize.define("Quiz", {
    quiz_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "quizzes",
    timestamps: false
});

export default Quiz;
