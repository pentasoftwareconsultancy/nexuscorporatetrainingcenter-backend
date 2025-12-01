import { Op } from "sequelize";
import Placement from "../../models/comman/placement.model.js";

class PlacementService {
  /* ---------------- CREATE ---------------- */
  async createPlacement(data) {
    return await Placement.create(data);
  }

  /* ---------------- GET ALL ---------------- */
  async getAllPlacements(search, limit, offset) {
    const where = {};

    if (search) {
      where.student_name = { [Op.like]: `%${search}%` };
    }

    const { rows, count } = await Placement.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return { total: count, data: rows };
  }

  /* ---------------- GET BY ID ---------------- */
  async getPlacementById(id) {
    return await Placement.findByPk(id);
  }

  /* ---------------- UPDATE ---------------- */
  async updatePlacement(id, data) {
    return await Placement.update(data, { where: { placement_id: id } });
  }

  /* ---------------- DELETE ---------------- */
  async deletePlacement(id) {
    return await Placement.destroy({ where: { placement_id: id } });
  }

  /* ---------------- BASIC LIST (With Filters + Pagination) ---------------- */
  async getBasicPlacementList(query, limit, offset) {
    const where = {};

    if (query.course) where.course_name = query.course;
    if (query.company) where.placed_in_company = query.company;

    if (query.search) {
      where.student_name = { [Op.like]: `%${query.search}%` };
    }

    const { rows, count } = await Placement.findAndCountAll({
      attributes: [
        "student_name",
        "email",
        "course_name",
        "placed_in_company"
      ],
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return { total: count, data: rows };
  }

  /* ---------------- MINIMAL LIST ---------------- */
  async getMinimalPlacements(search) {
    const where = {};

    if (search) {
      where.student_name = { [Op.like]: `%${search}%` };
    }

    return await Placement.findAll({
      attributes: ["student_name", "placed_in_company"],
      where,
      order: [["createdAt", "DESC"]],
    });
  }

  /* ---------------- STATS ---------------- */
  async getPlacementStats() {
    const total = await Placement.count();

    const courses = await Placement.findAll({
      attributes: ["course_name"],
    });

    const companies = await Placement.findAll({
      attributes: ["placed_in_company"],
    });

    return {
      totalPlacements: total,
      courses: courses.length,
      companies: companies.length,
    };
  }
}

export default new PlacementService();
