import Placement from "../../models/comman/placement.model.js";

class PlacementService {
  async createPlacement(data) {
    return await Placement.create(data);
  }

  async getAllPlacements(search) {
    const where = {};

    if (search) {
      where.student_name = { [Op.like]: `%${search}%` };
    }

    return await Placement.findAll({ where });
  }

  async getPlacementById(id) {
    return await Placement.findByPk(id);
  }

  async updatePlacement(id, data) {
    return await Placement.update(data, { where: { placement_id: id } });
  }

  async deletePlacement(id) {
    return await Placement.destroy({ where: { placement_id: id } });
  }

  async getTotalPlacements() {
    return await Placement.count();
  }

  async getBasicPlacementList() {
  return await Placement.findAll({
    attributes: [
      "student_name",
      "email",
      "course_name",
      "placed_in_company"
    ],
    order: [["createdAt", "DESC"]]
  });
}

}

export default new PlacementService();
