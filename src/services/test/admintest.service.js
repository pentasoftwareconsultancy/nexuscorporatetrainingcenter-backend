import {
  TestCategory,
  Test,
  Question,
  Option,
  UserAnswer,
  UserTest,
} from "../../models/test/test.models.js";
import { sequelize } from "../../config/db.js";
import { Op } from "sequelize";

class adminTestService {
  // ============================
  // CATEGORY + TEST (CREATE)
  // ============================
  async createCategoryWithTest(payload) {
    const { categoryName, testTitle, status } = payload;

    return await sequelize.transaction(async (t) => {
      const [category] = await TestCategory.findOrCreate({
        where: { name: categoryName },
        transaction: t,
      });

      const test = await Test.create(
        {
          title: testTitle,
          categoryId: category.id,
          status,
        },
        { transaction: t },
      );

      return { category, test };
    });
  }

  // ============================
  // CATEGORY → TEST LIST
  // ============================
  async getCategoriesWithTests() {
    return await TestCategory.findAll({
      include: {
        model: Test,
        as: "tests",
      },
      order: [["createdAt", "DESC"]],
    });
  }

  // ============================
  // QUESTION + OPTIONS (CREATE)
  // ============================
  async createQuestionWithOptions(payload) {
    const { testId, question_text, answer_explanation, options } = payload;

    return await sequelize.transaction(async (t) => {
      const question = await Question.create(
        { testId, question_text, answer_explanation },
        { transaction: t },
      );

      const optionPayload = options.map((o) => ({
        option_text: o.option_text,
        is_correct: o.is_correct,
        questionId: question.id,
      }));

      await Option.bulkCreate(optionPayload, { transaction: t });

      await Test.increment("total_questions", {
        where: { id: testId },
        transaction: t,
      });

      return question;
    });
  }

  // ============================
  // TEST → QUESTIONS → OPTIONS
  // ============================
  async getQuestionsByTest(testId) {
    return await Test.findByPk(testId, {
      include: {
        model: Question,
        as: "questions",
        include: {
          model: Option,
          as: "options",
        },
      },
    });
  }

  // ============================
  // QUESTION + OPTIONS (UPDATE)
  // ============================
  async updateQuestionWithOptions(questionId, payload) {
    const { question_text, answer_explanation, options } = payload;

    return await sequelize.transaction(async (t) => {
      await Question.update(
        { question_text, answer_explanation },
        { where: { id: questionId }, transaction: t },
      );

      await Option.destroy({
        where: { questionId },
        transaction: t,
      });

      await Option.bulkCreate(
        options.map((o) => ({
          option_text: o.option_text,
          is_correct: o.is_correct,
          questionId,
        })),
        { transaction: t },
      );

      return true;
    });
  }

  // ============================
  // DELETE QUESTION
  // ============================
  async deleteQuestion(questionId, testId) {
    return await sequelize.transaction(async (t) => {
      await Option.destroy({ where: { questionId }, transaction: t });
      await Question.destroy({ where: { id: questionId }, transaction: t });

      await Test.decrement("total_questions", {
        where: { id: testId },
        transaction: t,
      });
    });
  }

  // ============================
  // DELETE TEST (CASCADE)
  // ============================
  async deleteTest(testId) {
    return await sequelize.transaction(async (t) => {
      await Question.destroy({ where: { testId }, transaction: t });
      await Test.destroy({ where: { id: testId }, transaction: t });
    });
  }

  // ============================
  // DELETE CATEGORY (CASCADE)
  // ============================
  async deleteCategory(categoryId) {
    return await sequelize.transaction(async (t) => {
      const tests = await Test.findAll({ where: { categoryId } });

      for (const test of tests) {
        await Question.destroy({ where: { testId: test.id }, transaction: t });
      }

      await Test.destroy({ where: { categoryId }, transaction: t });
      await TestCategory.destroy({ where: { id: categoryId }, transaction: t });
    });
  }

  // ============================
  // CATEGORY + TEST (UPDATE)
  // ============================
  async updateCategoryWithTest(testId, payload) {
    const { categoryName, testTitle, status } = payload;

    return await sequelize.transaction(async (t) => {
      const test = await Test.findByPk(testId, { transaction: t });
      if (!test) throw new Error("Test not found");

      // update category
      if (categoryName) {
        await TestCategory.update(
          { name: categoryName },
          { where: { id: test.categoryId }, transaction: t },
        );
      }

      // update test
      await Test.update(
        { title: testTitle, status },
        { where: { id: testId }, transaction: t },
      );

      return true;
    });
  }

  // ============================
  // BULK QUESTIONS FROM EXCEL
  // ============================
  async createQuestionsWithOptionsBulk(testId, rows) {
    return await sequelize.transaction(async (t) => {
      let questionCount = 0;

      for (const row of rows) {
        const {
          Question: question_text,
          "Option A": optionA,
          "Option B": optionB,
          "Option C": optionC,
          "Option D": optionD,
          "Correct Option": correctOption,
          Explanation,
        } = row;

        if (!question_text || !correctOption) continue;

        // 1️⃣ create question
        const question = await Question.create(
          {
            testId,
            question_text,
            answer_explanation: Explanation,
          },
          { transaction: t },
        );

        // 2️⃣ create options (same structure as single API)
        const options = [
          { option_text: optionA, key: "A" },
          { option_text: optionB, key: "B" },
          { option_text: optionC, key: "C" },
          { option_text: optionD, key: "D" },
        ]
          .filter((o) => o.option_text)
          .map((o) => ({
            option_text: o.option_text,
            is_correct: o.key.toUpperCase() === correctOption.toUpperCase(),
            questionId: question.id,
          }));

        await Option.bulkCreate(options, { transaction: t });

        questionCount++;
      }

      // 3️⃣ update total_questions once
      await Test.increment("total_questions", {
        by: questionCount,
        where: { id: testId },
        transaction: t,
      });

      return {
        inserted: questionCount,
      };
    });
  }
}

export default new adminTestService();
