import cloudinary from "../../config/cloudinary.js";
import { sequelize } from "../../config/db.js";

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
        "year",
      ],
      include: [
        {
          model: PlacementCategory,
          attributes: ["name"],
        },
      ],
      order: [["year", "DESC"]],
    });

    const result = {};

    rows.forEach((p) => {
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
          as: "details",
        },
      ],
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
      placementCategoryId:
        newData.placementCategoryId ?? placement.placementCategoryId,
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
          as: "placement", // 👈 MUST MATCH association alias
        },
      ],
    });
  }

  async getPlacementDetails(placementId) {
    return await PlacementDetails.findOne({
      where: { placement_id: placementId },
      include: [
        {
          model: Placement,
          as: "placement", // 👈 SAME alias
        },
      ],
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
        [
          Sequelize.fn("COUNT", Sequelize.col("Placement.placement_id")),
          "total",
        ],
      ],
      group: [Sequelize.fn("YEAR", Sequelize.col("Placement.createdAt"))],
      order: [[Sequelize.literal("year"), "DESC"]],
    });
  }

  /* ---------------- ALL PLACEMENT DATA ---------------- */
  async getAllPlacementDataByPlacementId(placementId) {
    return await Placement.findOne({
      where: { placement_id: placementId },
      include: [
        {
          model: PlacementCategory,
          attributes: ["placementCategoryId", "name"],
        },
        {
          model: PlacementDetails,
          as: "details",
          attributes: [
            "placementDetails_id",
            "success_story",
            "facing_challenges",
            "program_highlights",
            "final_evaluation",
            "overall_experience",
          ],
        },
      ],
    });
  }

  async updateFullPlacement(placementId, body, filePath) {
    const transaction = await sequelize.transaction();

    try {
      const placement = await Placement.findByPk(placementId, {
        include: [{ model: PlacementDetails, as: "details" }],
        transaction,
      });

      if (!placement) return null;

      /* ---------- IMAGE UPDATE ---------- */
      let image = placement.image;
      let cloudinaryId = placement.cloudinaryId;

      if (filePath) {
        if (cloudinaryId) {
          await cloudinary.uploader.destroy(cloudinaryId);
        }

        const upload = await cloudinary.uploader.upload(filePath, {
          folder: "nexus/placements",
        });

        image = upload.secure_url;
        cloudinaryId = upload.public_id;
      }

      /* ---------- UPDATE PLACEMENT ---------- */
      if (body.placement) {
        await placement.update(
          {
            ...body.placement,
            image,
            cloudinaryId,
          },
          { transaction }
        );
      }

      /* ---------- UPDATE DETAILS ---------- */
      if (body.details) {
        if (placement.details) {
          await placement.details.update(body.details, { transaction });
        } else {
          await PlacementDetails.create(
            {
              placement_id: placementId,
              ...body.details,
            },
            { transaction }
          );
        }
      }

      await transaction.commit();

      return await Placement.findByPk(placementId, {
        include: [
          { model: PlacementCategory },
          { model: PlacementDetails, as: "details" },
        ],
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async createFullPlacement(body, filePath) {
    const transaction = await sequelize.transaction();

    try {
      const { category, placement, details } = body;

      /* ---------- 1. CATEGORY CHECK / CREATE ---------- */
      let categoryRecord = await PlacementCategory.findOne({
        where: { name: category.name },
        transaction,
      });

      if (!categoryRecord) {
        categoryRecord = await PlacementCategory.create(
          { name: category.name },
          { transaction }
        );
      }

      /* ---------- 2. IMAGE UPLOAD ---------- */
      let image = null;
      let cloudinaryId = null;

      if (filePath) {
        const upload = await cloudinary.uploader.upload(filePath, {
          folder: "nexus/placements",
        });

        image = upload.secure_url;
        cloudinaryId = upload.public_id;
      }

      /* ---------- 3. CREATE PLACEMENT ---------- */
      const placementRecord = await Placement.create(
        {
          placementCategoryId: categoryRecord.placementCategoryId,
          ...placement,
          image,
          cloudinaryId,
        },
        { transaction }
      );

      /* ---------- 4. CREATE DETAILS ---------- */
      if (details) {
        await PlacementDetails.create(
          {
            placement_id: placementRecord.placement_id,
            ...details,
          },
          { transaction }
        );
      }

      await transaction.commit();

      /* ---------- 5. RETURN FULL OBJECT ---------- */
      return await Placement.findByPk(placementRecord.placement_id, {
        include: [
          { model: PlacementCategory },
          { model: PlacementDetails, as: "details" },
        ],
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
export default new PlacementService();
