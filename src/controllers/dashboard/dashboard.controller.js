import { getDashboardCounts } from "../../services/dashboard/dashboard.service.js";
import User from "../../models/users/user.model.js";
import { Op } from "sequelize";

/**
 * GET /admin/dashboard-stats
 * Returns all dashboard counts + monthly/yearly registrations
 */
export async function dashboardStats(req, res) {
  try {
    const data = await getDashboardCounts();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ success: false, message: "Stats load failed" });
  }
}

/**
 * GET /admin/users
 * Returns all registered users with username/emailOrPhone/phoneNumber
 */
export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ["id", "userName", "emailOrPhone", "phoneNumber"],
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    res.json({ success: true, data: users });
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ success: false, message: "Failed to load users" });
  }
}

/**
 * GET /admin/users/new
 * Returns users registered in the last 7 days
 */
export async function getNewUsers(req, res) {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const users = await User.findAll({
      attributes: ["id", "userName", "emailOrPhone", "phoneNumber", "createdAt"],
      where: { createdAt: { [Op.gte]: oneWeekAgo } },
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    res.json({ success: true, data: users });
  } catch (err) {
    console.error("Get New Users Error:", err);
    res.status(500).json({ success: false, message: "Failed to load new users" });
  }
}
