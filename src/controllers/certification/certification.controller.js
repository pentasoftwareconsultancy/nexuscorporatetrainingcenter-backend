// src/modules/certification/certification.controller.js
import Certification from "../../models/certification/certification.model.js";

/**
 * GET /certifications/me
 */
export async function getMyCertifications(req, res) {
  try {
    const userId = req.user.id; // from JWT middleware

    const certifications = await Certification.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: certifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch certifications",
    });
  }
}
