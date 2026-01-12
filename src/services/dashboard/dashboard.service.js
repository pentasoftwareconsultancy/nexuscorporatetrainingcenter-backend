import { Op, fn, col } from "sequelize";
import User from "../../models/users/user.model.js";
import { College } from "../../models/media/media.models.js";
import { Placement } from "../../models/comman/placement.model.js";
import { UserTest } from "../../models/test/test.models.js";
import Review from "../../models/reviews/review.model.js";

export async function getDashboardCounts() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const [
    totalUsers,
    newUsers,
    completedTests,
    totalColleges,
    totalPlacements,
    totalReviews,
    monthlyRegistrations,
    yearlyRegistrations
  ] = await Promise.all([
    User.count(),
    User.count({ where: { createdAt: { [Op.gte]: oneWeekAgo } } }),
    UserTest.count({ where: { score: { [Op.gte]: 70 } } }),
    College.count(),
    Placement.count(),
    Review.count(),

    // Monthly aggregation for current year
    User.findAll({
      attributes: [
        [fn("MONTH", col("createdAt")), "month"],
        [fn("COUNT", col("id")), "count"]
      ],
      group: ["month"],
      raw: true,
      order: [[fn("MONTH", col("createdAt")), "ASC"]]
    }),

    // Yearly aggregation
    User.findAll({
      attributes: [
        [fn("YEAR", col("createdAt")), "year"],
        [fn("COUNT", col("id")), "count"]
      ],
      group: ["year"],
      raw: true,
      order: [[fn("YEAR", col("createdAt")), "ASC"]]
    }),
  ]);

  return {
    totalUsers,
    newUsers,
    oldUsers: totalUsers - newUsers,
    completedTests,
    totalColleges,
    totalPlacements,
    totalReviews,
    monthlyRegistrations,
    yearlyRegistrations
  };
}
