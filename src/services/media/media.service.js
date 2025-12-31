import cloudinary from "../../config/cloudinary.js";
import { City, College, Media } from "../../models/media/media.models.js";

class MediaService {
  /* ================= CREATE ================= */
  async create(body, files) {
    const { type } = body;

    if (type !== "media") throw new Error("Invalid create type");

    // ---------- CITY ----------
    let city = await City.findOne({
      where: { name: body.cityName.trim().toLowerCase() },
    });

    if (!city) {
      city = await City.create({
        name: body.cityName.trim().toLowerCase(),
      });
    }

    // ---------- COLLEGE ----------
    let college = await College.findOne({
      where: {
        name: body.collegeName,
        cityId: city.id,
      },
    });

    if (!college) {
      college = await College.create({
        name: body.collegeName,
        cityId: city.id,
      });
    }

    // ---------- MEDIA ----------
    const uploaded = [];

    for (const file of files) {
      const upload = await cloudinary.uploader.upload(file.path, {
        folder: "nexus/colleges",
      });

      const media = await Media.create({
        url: upload.secure_url,
        caption: body.caption || null,
        description: body.description || null,
        collegeId: college.id,
      });

      uploaded.push(media);
    }

    return {
      message: "Media created successfully",
      city,
      college,
      uploaded,
    };
  }

  /* ================= GET ================= */
  async get(query) {
    const { type, collegeId } = query;

    if (type !== "media") throw new Error("Invalid get type");

    const college = await College.findByPk(collegeId, {
      include: [
        { model: City, as: "city" },
        { model: Media, as: "images" },
      ],
    });

    if (!college) throw new Error("College not found");

    return college;
  }

  /* ================= UPDATE ================= */
  async update(body, files) {
    const {
      type,
      collegeId,
      mediaId,
      caption,
      description,
      cityName,
      collegeName,
    } = body;

    if (type !== "media") throw new Error("Invalid update type");

    // ---------- COLLEGE ----------
    const college = await College.findByPk(collegeId);
    if (!college) throw new Error("College not found");

    // ---------- CITY ----------
    const city = await City.findByPk(college.cityId);
    if (!city) throw new Error("City not found");

    // Update city name
    if (cityName) {
      city.name = cityName.trim().toLowerCase();
      await city.save();
    }

    // Update college name
    if (collegeName) {
      college.name = collegeName;
      await college.save();
    }

    // ---------- MEDIA ----------
    const media = await Media.findByPk(mediaId);
    if (!media) throw new Error("Media not found");

    let updateData = {
      caption: caption ?? media.caption,
      description: description ?? media.description,
    };

    // Replace Image
    if (files && files.length > 0) {
      const file = files[0];

      const oldUrl = media.url;
      const publicId = oldUrl.split("/").pop().split(".")[0];

      await cloudinary.uploader.destroy(`nexus/colleges/${publicId}`);

      const upload = await cloudinary.uploader.upload(file.path, {
        folder: "nexus/colleges",
      });

      updateData.url = upload.secure_url;
    }

    await media.update(updateData);

    return {
      message: "Updated successfully",
      city,
      college,
      media,
    };
  }

  /* ================= DELETE ================= */
  async remove(body) {
    const { type, collegeId } = body;

    if (type !== "media") throw new Error("Invalid delete type");

    const college = await College.findByPk(collegeId, {
      include: [{ model: Media, as: "images" }],
    });

    if (!college) throw new Error("College not found");

    // delete all media
    for (const img of college.images) {
      await Media.destroy({ where: { id: img.id } });
    }

    // delete college
    await college.destroy();

    return { message: "College & Media Deleted, City Preserved" };
  }

  // for single operations
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

  async getCollegeById(collegeId) {
    const college = await College.findByPk(collegeId, {
      include: [
        { model: City, as: "city" },
        { model: Media, as: "images" },
      ],
    });

    if (!college) throw new Error("College not found");
    return college;
  }

  /* ========== MEDIA / IMAGES (MULTIPLE) ========== */
  async uploadImages(collegeId, files, caption, description) {
    const uploadedImages = [];

    for (const file of files) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: "nexus/colleges",
      });

      const media = await Media.create({
        url: uploaded.secure_url,
        caption,
        description,
        collegeId,
      });

      uploadedImages.push(media);
    }

    return uploadedImages;
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

  /* ===================== MEDIA ===================== */
  async updateMedia(id, body) {
    const media = await Media.findByPk(id);
    if (!media) throw new Error("Media not found");

    await media.update({
      caption: body.caption ?? media.caption,
      description: body.description ?? media.description,
      url: body.url ?? media.url,
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
