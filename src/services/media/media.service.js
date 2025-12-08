import cloudinary from "../../config/cloudinary.js";
import { City, College, Media } from "../../models/media/media.models.js";

class MediaService {
  /* ========== CITY ========== */
  async createCity(body) {
    return await City.create(body);
  }

  async getCities() {
    return await City.findAll({
      include: [{ model: College, as: "colleges" }],
      order: [["id", "DESC"]],
    });
  }

  /* ========== COLLEGE ========== */
  async createCollege(body) {
    return await College.create(body);
  }

  async getCollegesByCity(cityId) {
    return await College.findAll({
      where: { cityId },
      include: [{ model: Media, as: "images" }],
    });
  }

  /* ========== MEDIA / IMAGES ========== */
  async uploadImage(collegeId, filePath, caption) {
    const uploaded = await cloudinary.uploader.upload(filePath, {
      folder: "nexus/colleges",
    });

    return await Media.create({
      url: uploaded.secure_url,
      caption,
      collegeId,
    });
  }

  async getImagesByCollege(collegeId) {
    return await Media.findAll({
      where: { collegeId },
      order: [["id", "DESC"]],
    });
  }

  /* ===================== CITY ===================== */

  async updateCity(id, body) {
    const city = await City.findByPk(id);
    if (!city) throw new Error("City not found");

    await city.update(body);
    return city;
  }

  async deleteCity(id) {
    const city = await City.findByPk(id);
    if (!city) throw new Error("City not found");

    await city.destroy();
    return { message: "City deleted successfully" };
  }

  /* ===================== COLLEGE ===================== */

  async updateCollege(id, body) {
    const college = await College.findByPk(id);
    if (!college) throw new Error("College not found");

    await college.update(body);
    return college;
  }

  async deleteCollege(id) {
    const college = await College.findByPk(id);
    if (!college) throw new Error("College not found");

    await college.destroy();
    return { message: "College deleted successfully" };
  }

  /* ===================== MEDIA (IMAGE) ===================== */

  async updateMedia(id, body) {
    const media = await Media.findByPk(id);
    if (!media) throw new Error("Media not found");

    await media.update({
      caption: body.caption ?? media.caption,
      url: body.url ?? media.url, // Optional, only update if provided
      collegeId: body.collegeId ?? media.collegeId,
    });

    return media;
  }

  async deleteMedia(id) {
    const media = await Media.findByPk(id);
    if (!media) throw new Error("Media not found");

    await media.destroy();
    return { message: "Media deleted successfully" };
  }
}

export default new MediaService();
