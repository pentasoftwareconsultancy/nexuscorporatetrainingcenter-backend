import User from "../users/user.model.js";
import { Batch, Course, CourseCategory } from "../master/master.models.js";
import { City, College, Media } from "../media/media.models.js";
import { Event, EventImage } from "../events/event.models.js";
import {
  Option,
  Question,
  Test,
  TestCategory,
  UserAnswer,
  UserTest,
} from "../test/test.models.js";

export function setupAssociations() {
  /* COURSE CATEGORY → COURSE */
  CourseCategory.hasMany(Course, { foreignKey: "categoryId", as: "courses" });
  Course.belongsTo(CourseCategory, {
    foreignKey: "categoryId",
    as: "category",
  });

  //--------------------------
  // USER ↔ COURSE
  //--------------------------
  User.hasMany(Course, { foreignKey: "createdBy" });
  Course.belongsTo(User, { foreignKey: "createdBy" });

  //--------------------------
  // COURSE ↔ BATCH
  //--------------------------
  Course.hasMany(Batch, { foreignKey: "courseId" });
  Batch.belongsTo(Course, { foreignKey: "courseId" });

  //--------------------------
  // BATCH ↔ USER (Many-to-Many)
  //--------------------------
  Batch.belongsToMany(User, {
    through: "BatchStudents",
    foreignKey: "batchId",
    otherKey: "userId",
    as: "students",
  });

  User.belongsToMany(Batch, {
    through: "BatchStudents",
    foreignKey: "userId",
    otherKey: "batchId",
    as: "batches",
  });

  /* CITY → COLLEGE */
  City.hasMany(College, { foreignKey: "cityId", as: "colleges" });
  College.belongsTo(City, { foreignKey: "cityId", as: "city" });

  /* COLLEGE → MEDIA */
  College.hasMany(Media, { foreignKey: "collegeId", as: "images" });
  Media.belongsTo(College, { foreignKey: "collegeId", as: "college" });

  //--------------------------
  // EVENT ↔ EVENT IMAGES
  //--------------------------
  Event.hasMany(EventImage, {
    foreignKey: "eventId",
    as: "images",
  });

  EventImage.belongsTo(Event, {
    foreignKey: "eventId",
    as: "event",
  });

  // CATEGORY → TEST
  TestCategory.hasMany(Test, { foreignKey: "categoryId", as: "tests" });
  Test.belongsTo(TestCategory, { foreignKey: "categoryId", as: "category" });

  // TEST → QUESTIONS
  Test.hasMany(Question, { foreignKey: "testId", as: "questions" });
  Question.belongsTo(Test, { foreignKey: "testId", as: "test" });

  // QUESTION → OPTIONS
  Question.hasMany(Option, { foreignKey: "questionId", as: "options" });
  Option.belongsTo(Question, { foreignKey: "questionId", as: "question" });

  // USER → USER TEST
  UserTest.hasMany(UserAnswer, { foreignKey: "userTestId", as: "answers" });
  UserAnswer.belongsTo(UserTest, { foreignKey: "userTestId" });

  // TEST → USER TEST
  Test.hasMany(UserTest, { foreignKey: "testId" });
  UserTest.belongsTo(Test, { foreignKey: "testId" });

  // USER TEST → USER ANSWER
  // USERTEST → USERANSWER
  UserTest.hasMany(UserAnswer, {
    foreignKey: "userTestId",
    as: "userAnswers", //  CHANGE alias
  });

  UserAnswer.belongsTo(UserTest, {
    foreignKey: "userTestId",
    as: "userTest",
  });

  // QUESTION → USER ANSWER
  Question.hasMany(UserAnswer, { foreignKey: "questionId" });
  UserAnswer.belongsTo(Question, { foreignKey: "questionId" });

  // OPTION → USER ANSWER
  Option.hasMany(UserAnswer, { foreignKey: "optionId" });
  UserAnswer.belongsTo(Option, { foreignKey: "optionId" });
}
