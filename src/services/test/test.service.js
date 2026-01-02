import {
  TestCategory,
  Test,
  Question,
  Option,
  UserAnswer,
  UserTest,
} from "../../models/test/test.models.js";
import User from "../../models/users/user.model.js";
import { Op, Sequelize } from "sequelize";

class TestService {
  // CATEGORY
  async createCategory(body) {
    return await TestCategory.create(body);
  }
  async getCategories() {
    return await TestCategory.findAll();
  }

  // TEST
  async createTest(body) {
    return await Test.create(body);
  }

  async getTests() {
    return await Test.findAll({
      include: [{ model: Question, as: "questions" }],
    });
  }

  async getTestById(id) {
    const test = await Test.findByPk(id, {
      attributes: ["id", "title"],
      include: [
        {
          model: Question,
          as: "questions",
          attributes: ["id", "question_text"],
          include: [
            {
              model: Option,
              as: "options",
              attributes: ["id", "option_text", "is_correct"],
            },
          ],
        },
      ],
    });

    if (!test) throw new Error("Test not found");
    return test;
  }

  async updateTest(id, body) {
    const test = await Test.findByPk(id);
    if (!test) throw new Error("Test not found");

    await test.update(body);
    return test;
  }

  async deleteTest(id) {
    const test = await Test.findByPk(id);
    if (!test) throw new Error("Test not found");

    await test.destroy();
    return { deleted: true };
  }

  // QUESTION
  async createQuestion(body) {
    return await Question.create(body);
  }

  async getQuestion(id) {
    const question = await Question.findByPk(id, {
      include: [{ model: Option, as: "options" }],
    });
    if (!question) throw new Error("Question not found");
    return question;
  }

  // OPTION
  async addOption(body) {
    const { questionId } = body;
    const count = await Option.count({ where: { questionId } });

    if (count >= 4) {
      throw new Error("Cannot add more than 4 options");
    }
    return await Option.create(body);
  }

  async getOption(id) {
    const option = await Option.findByPk(id);
    if (!option) throw new Error("Option not found");
    return option;
  }

  // SUBMIT TEST WITH ATTEMPT_NUMBER + UPDATE ANSWER SUPPORT
  async submitTest(userId, body) {
    const { testId, answers, title } = body;
    let correct = 0;

    // Find last attempt
    const lastAttempt = await UserTest.findOne({
      where: { userId, testId },
      order: [["attempt_number", "DESC"]],
    });

    const attempt_number = lastAttempt ? lastAttempt.attempt_number + 1 : 1;

    // Create new test attempt
    const userTest = await UserTest.create({
      userId,
      testId,
      attempt_number,
      title,
      total_questions: answers.length,
      attempted: answers.length,
      correct_answers: 0,
      score: 0,
    });

    // Process answers
    for (const ans of answers) {
      const option = await Option.findByPk(ans.optionId);
      const isCorrect = option?.is_correct === true;

      // Check if answer exists for THIS attempt
      let existing = await UserAnswer.findOne({
        where: {
          userTestId: userTest.id,
          questionId: ans.questionId,
        },
      });

      if (existing) {
        await existing.update({
          optionId: ans.optionId,
          is_correct: isCorrect,
        });
      } else {
        await UserAnswer.create({
          userTestId: userTest.id,
          questionId: ans.questionId,
          optionId: ans.optionId,
          is_correct: isCorrect,
        });
      }

      if (isCorrect) correct++;
    }

    await userTest.update({
      correct_answers: correct,
      score: (correct / answers.length) * 100,
    });

    return userTest;
  }

  async getLatestAttempt(userId, testId) {
    return await UserTest.findOne({
      where: { userId, testId },
      order: [["attempt_number", "DESC"]], // or id DESC
    });
  }

  // ------------------------- Result View --------------------------------------
  async getLoggedInUserLatestSummary(userId) {
    const userTest = await UserTest.findOne({
      where: { userId },
      order: [["id", "DESC"]], // 👈 latest attempt by UserTest id
      include: [
        {
          model: UserAnswer,
          as: "userAnswers",
          include: [
            {
              model: Question,
              attributes: ["id", "question_text", "answer_explanation"],
              include: [
                {
                  model: Option,
                  as: "options",
                  attributes: ["id", "option_text", "is_correct"],
                },
              ],
            },
            {
              model: Option,
              attributes: ["id", "option_text", "is_correct"],
            },
          ],
        },
      ],
    });

    if (!userTest) return null;

    return {
      userTestId: userTest.id,
      testId: userTest.testId,
      attempt_number: userTest.attempt_number,
      total_questions: userTest.total_questions,
      correct_answers: userTest.correct_answers,
      score: userTest.score,

      questions: userTest.userAnswers.map((ua) => ({
        questionId: ua.Question.id,
        question_text: ua.Question.question_text,
        answer_explanation: ua.Question.answer_explanation,

        options: ua.Question.options.map((o) => ({
          id: o.id,
          text: o.option_text,
          is_correct: o.is_correct === true,
        })),

        user_selected_option_id: ua.optionId,
        user_selected_option_text: ua.Option?.option_text ?? null,
        user_is_correct: ua.is_correct === true,

        correct_option: ua.Question.options.find((o) => o.is_correct === true)
          ? {
              id: ua.Question.options.find((o) => o.is_correct === true).id,
              text: ua.Question.options.find((o) => o.is_correct === true)
                .option_text,
            }
          : null,
      })),
    };
  }

  // ---------------------------- Certification ---------------------------------
  async getCertifiedCategories(userId) {
    // Latest attempt per test
    const latestAttempts = await UserTest.findAll({
      where: { userId },
      attributes: [
        "testId",
        [Sequelize.fn("MAX", Sequelize.col("id")), "latestUserTestId"],
      ],
      group: ["testId"],
      raw: true,
    });

    const latestIds = latestAttempts.map((a) => a.latestUserTestId);

    const passedTests = await UserTest.findAll({
      where: {
        id: { [Op.in]: latestIds },
        score: { [Op.gte]: 75 },
      },
      include: [
        {
          model: Test,
          as: "test",
          include: [{ model: TestCategory, as: "category" }],
        },
        {
          model: User,
          as: "user", // 👈 must match the alias from UserTest.belongsTo(User)
        },
      ],
    });

    if (!passedTests.length) return [];

    // Group & verify category completion
    const categoryMap = {};

    for (const attempt of passedTests) {
      const catId = attempt.test.category.id;

      if (!categoryMap[catId]) {
        const totalTestsInCategory = await Test.count({
          where: { categoryId: catId },
        });

        categoryMap[catId] = {
          categoryId: catId,
          categoryName: attempt.test.category.name,
          userName: attempt.user.userName,
          userId,
          totalTests: totalTestsInCategory,
          passedTests: 0,
        };
      }

      categoryMap[catId].passedTests++;
    }

    return Object.values(categoryMap).filter(
      (c) => c.totalTests === c.passedTests
    );
  }
}

export default new TestService();
