import {
  TestCategory,
  Test,
  Question,
  Option,
  UserAnswer,
  UserTest,
} from "../../models/test/test.models.js";

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

    // 1️⃣ Find last attempt
    const lastAttempt = await UserTest.findOne({
      where: { userId, testId },
      order: [["attempt_number", "DESC"]],
    });

    const attempt_number = lastAttempt ? lastAttempt.attempt_number + 1 : 1;

    // 2️⃣ Create new test attempt
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

    // 3️⃣ Process answers
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

    // 4️⃣ Final score
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
}

export default new TestService();
