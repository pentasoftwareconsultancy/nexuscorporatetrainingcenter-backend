// src/modules/certification/certification.service.js
import { fn, col } from "sequelize";
import { sequelize } from "../../config/db.js";

import User from "../../models/users/user.model.js";
import { Test, TestCategory, UserTest } from "../../models/test/test.models.js";
import Certification from "../../models/certification/certification.model.js";

/**
 * Recalculate certifications for ONE user
 * (called automatically after UserTest changes)
 */
export async function recalculateUserCertifications(userId) {
  const transaction = await sequelize.transaction();

  try {
    /**
     * 1. Get max score per test for user
     */
    const maxScores = await UserTest.findAll({
      where: { userId },
      attributes: ["testId", [fn("MAX", col("score")), "maxScore"]],
      group: ["testId"],
      raw: true,
    });

    /**
     * 2. Group by category
     */
    const categoryMap = {};

    for (const row of maxScores) {
      if (row.maxScore < 80) continue;

      const test = await Test.findByPk(row.testId, {
        include: {
          model: TestCategory,
          as: "category",
          attributes: ["id", "name"],
        },
      });

      if (!test || !test.category) continue;

      const categoryId = test.category.id;

      if (!categoryMap[categoryId]) {
        categoryMap[categoryId] = {
          categoryId,
          categoryName: test.category.name,
          scores: [],
          passedTests: new Set(),
        };
      }

      categoryMap[categoryId].scores.push(Number(row.maxScore));
      categoryMap[categoryId].passedTests.add(row.testId);
    }

    /**
     * 3. Validate eligibility + calculate avg
     */
    const user = await User.findByPk(userId);
    if (!user) return;

    for (const categoryId of Object.keys(categoryMap)) {
      const data = categoryMap[categoryId];

      const totalTests = await Test.count({
        where: { categoryId },
      });

      const eligibility = data.passedTests.size === totalTests;
      const averageScore =
        data.scores.reduce((a, b) => a + b, 0) / data.scores.length;

      await Certification.upsert(
        {
          userId,
          userName: user.userName, // make sure you use the correct field from your users table
          categoryId,
          categoryName: data.categoryName,
          averageScore: averageScore.toFixed(2),
          eligibility,
        },
        {
          transaction,
          fields: [
            "userId",
            "userName", // 👈 include this
            "categoryId",
            "categoryName",
            "averageScore",
            "eligibility",
            "createdAt",
            "updatedAt",
          ],
        }
      );
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
