import {
  Placement,
  PlacementCategory,
  PlacementDetails,
} from "../../models/comman/placement.model.js";
import { Op, Sequelize } from "sequelize";

class PlacementService {
  /* ---------------- CATEGORY ---------------- */
  async createCategory(data) {
    return await PlacementCategory.create(data);
  }

  async getAllCategories() {
    return await PlacementCategory.findAll();
  }

  async updateCategory(id, data) {
    return await PlacementCategory.update(data, {
      where: { placementCategoryId: id },
    });
  }

  async deleteCategory(id) {
    return await PlacementCategory.destroy({
      where: { placementCategoryId: id },
    });
  }

  /* ---------------- PLACEMENTS ---------------- */
  async createPlacement(data) {
    return await Placement.create(data);
  }

  async getAllPlacements(search, limit, offset) {
    const where = {};

    if (search) {
      where.student_name = { [Op.like]: `%${search}%` };
    }

    const result = await Placement.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [{ model: PlacementCategory }],
    });

    return { total: result.count, data: result.rows };
  }

  async getPlacementById(id) {
    return await Placement.findByPk(id, {
      include: [
        { model: PlacementCategory },
        { model: PlacementDetails },
      ],
    });
  }

  async updatePlacement(id, data) {
    return await Placement.update(data, {
      where: { placement_id: id },
    });
  }

  async deletePlacement(id) {
    return await Placement.destroy({ where: { placement_id: id } });
  }

  /* ---------------- DETAILS (1:1) ---------------- */
  async createPlacementDetails(data) {
    return await PlacementDetails.create(data);
  }

  async getAllPlacementDetails() {
  return await PlacementDetails.findAll({
    include: [
      {
        model: Placement,
        as: "placement"  // 👈 MUST MATCH association alias
      }
    ],
  });
}

 async getPlacementDetails(placementId) {
  return await PlacementDetails.findOne({
    where: { placement_id: placementId },
    include: [
      {
        model: Placement,
        as: "placement"  // 👈 SAME alias
      }
    ]
  });
}

  async updatePlacementDetails(id, data) {
    return await PlacementDetails.update(data, {
      where: { placementDetails_id: id },
    });
  }

 


  /* ---------------- YEAR-WISE REPORT ---------------- */
 async getYearWisePlacement() {
  return await Placement.findAll({
    attributes: [
      [Sequelize.fn("YEAR", Sequelize.col("Placement.createdAt")), "year"],
      [Sequelize.fn("COUNT", Sequelize.col("Placement.placement_id")), "total"],
    ],
    group: [Sequelize.fn("YEAR", Sequelize.col("Placement.createdAt"))],
    order: [[Sequelize.literal("year"), "DESC"]],
  });
}
}
export default new PlacementService();
