import cloudinary from "../../config/cloudinary.js";

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

async getCategoryYearWisePlacements() {
  const rows = await Placement.findAll({
    attributes: [
      "placement_id",
      "student_name",
      "company_name",
      "company_role",
      "course",
      "package",
      "image",
      "year"
    ],
    include: [
      {
        model: PlacementCategory,
        attributes: ["name"]
      }
    ],
    order: [["year", "DESC"]]
  });

  const result = {};

  rows.forEach(p => {
    const category = p.PlacementCategory.name;
    const year = p.year;

    if (!result[category]) result[category] = {};
    if (!result[category][year]) result[category][year] = [];

    result[category][year].push(p);
  });

  return result;
}

async getFullPlacementById(placementId) {
  return await Placement.findByPk(placementId, {
    include: [
      {
        model: PlacementDetails,
        as: "details"
      }
    ]
  });
}


  /* ================= CREATE PLACEMENT ================= */
  async createPlacement(data, filePath) {
    let uploadedImage = null;

    if (filePath) {
      uploadedImage = await cloudinary.uploader.upload(filePath, {
        folder: "nexus/placements",
      });
    }

    return await Placement.create({
      placementCategoryId: data.placementCategoryId,
      student_name: data.student_name,
      company_name: data.company_name,
      company_role: data.company_role,
      course: data.course,
      year: data.year,
      package: data.package,
      image: uploadedImage?.secure_url || null,
      cloudinaryId: uploadedImage?.public_id || null,
      email: data.email,       
      duration: data.duration,
    });
  }
  

  /* ================= GET ALL ================= */
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

  /* ================= GET BY ID ================= */
  async getPlacementById(id) {
    return await Placement.findByPk(id, {
      include: [{ model: PlacementCategory }],
    });
  }

  /* ================= UPDATE ================= */
  async updatePlacement(id, newData, newFilePath) {
    const placement = await Placement.findByPk(id);
    if (!placement) return null;

    let updatedImage = placement.image;
    let updatedCloudId = placement.cloudinaryId;

    // If uploading new file
    if (newFilePath) {
      if (placement.cloudinaryId) {
        await cloudinary.uploader.destroy(placement.cloudinaryId);
      }

      const newUploaded = await cloudinary.uploader.upload(newFilePath, {
        folder: "nexus/placements",
      });

      updatedImage = newUploaded.secure_url;
      updatedCloudId = newUploaded.public_id;
    }

    await placement.update({
      placementCategoryId: newData.placementCategoryId ?? placement.placementCategoryId,
      student_name: newData.student_name ?? placement.student_name,
      company_name: newData.company_name ?? placement.company_name,
      company_role: newData.company_role ?? placement.company_role,
      course: newData.course ?? placement.course,
      year: newData.year ?? placement.year,
      package: newData.package ?? placement.package,
      image: updatedImage,
      cloudinaryId: updatedCloudId,
      email: newData.email ?? placement.email,       
      duration: newData.duration ?? placement.duration, 
    });

    return placement;
  }

  /* ================= DELETE ================= */
  async deletePlacement(id) {
    const placement = await Placement.findByPk(id);
    if (!placement) return null;

    if (placement.cloudinaryId) {
      await cloudinary.uploader.destroy(placement.cloudinaryId);
    }

    await placement.destroy();
    return true;
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

  async deletePlacementDetails(id) {
    return await PlacementDetails.destroy({
      where: { placement_id: id },
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
