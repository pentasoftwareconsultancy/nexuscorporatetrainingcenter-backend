import {
  TestCategory,
  Test,
  Question,
  Option,
  UserAnswer,
  UserTest,
} from "../../models/test/test.models.js";

class TestService {
  // -------------------- CATEGORY --------------------
  async createCategory(body) {
    return await TestCategory.create(body);
  }

  async getCategories() {
    return await TestCategory.findAll();
  }

  // -------------------- TEST --------------------
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

  // -------------------- QUESTION --------------------
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

  // -------------------- OPTIONS --------------------
  async addOption(body) {
    const { questionId } = body;
    
    // 1️⃣ Count existing options for this question
    const count = await Option.count({ where: { questionId } });
    
    if (count >= 4) {
      throw new Error("Cannot add more than 4 options for a question");
    }
  
    // 2️⃣ Create the new option
    return await Option.create(body);
  }

  async getOption(id) {
    const option = await Option.findByPk(id);
    if (!option) throw new Error("Option not found");
    return option;
  }

  // -------------------- SUBMIT TEST --------------------
  async submitTest(userId, body) {
    const { testId, answers } = body;

    let correct = 0;

    // STEP 1: Create UserTest FIRST
    const userTest = await UserTest.create({
      userId,
      testId,
      total_questions: answers.length,
      attempted: answers.length,
      correct_answers: 0,
      score: 0,
    });

    // STEP 2: LOOP all answers
    for (const ans of answers) {
      const option = await Option.findByPk(ans.optionId);
      const isCorrect = option?.is_correct === true;

      // 🔍 STEP 3: Check if answer exists
      let existing = await UserAnswer.findOne({
        where: {
          userTestId: userTest.id,
          questionId: ans.questionId,
        },
      });

      if (existing) {
        // ✏️ UPDATE previous answer
        await existing.update({
          optionId: ans.optionId,
          is_correct: isCorrect,
        });
      } else {
        // ➕ CREATE new answer
        await UserAnswer.create({
          userTestId: userTest.id,
          questionId: ans.questionId,
          optionId: ans.optionId,
          is_correct: isCorrect,
        });
      }

      if (isCorrect) correct++;
    }

    // STEP 4: Update final score
    const finalScore = (correct / answers.length) * 100;

    await userTest.update({
      correct_answers: correct,
      score: finalScore,
    });

    return userTest;
  }
}

export default new TestService();
