import cloudinary from "../../config/cloudinary.js";
import { City, College, Media } from "../../models/media/media.models.js";

class MediaService {
  /* ================= CREATE ================= */
  async create(body, files) {
    const { type } = body;

    if (type === "city") {
      const name = body.name.trim().toLowerCase();

      const exists = await City.findOne({ where: { name } });
      if (exists) throw new Error("City already exists");

      return await City.create({ name });
    }

    if (type === "college") {
      return await College.create({
        name: body.name,
        cityId: body.cityId,
      });
    }

    if (type === "media") {
      const cityName = body.cityName.trim().toLowerCase();

      let city = await City.findOne({ where: { name: cityName } });
      if (!city) city = await City.create({ name: cityName });

      let college = await College.findOne({
        where: { name: body.collegeName, cityId: city.id },
      });

      if (!college) {
        college = await College.create({
          name: body.collegeName,
          cityId: city.id,
        });
      }

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

      return uploaded;
    }

    throw new Error("Invalid create type");
  }

  /* ================= GET ================= */
  async get(query) {
    const { type } = query;

    if (type === "city") {
      return await City.findAll({
        include: [{ model: College, as: "colleges", include: ["images"] }],
      });
    }

    if (type === "college") {
      return await College.findAll({
        where: { cityId: query.cityId },
        include: ["images"],
      });
    }

    if (type === "media") {
      return await Media.findAll({
        where: { collegeId: query.collegeId },
      });
    }

    throw new Error("Invalid get type");
  }

  /* ================= UPDATE ================= */
  async update(body, files) {
    const { type, id, caption, description } = body;

    if (type !== "media") {
      throw new Error("Only media image update supported here");
    }

    const media = await Media.findByPk(id);
    if (!media) throw new Error("Media not found");

    let updatedData = {
      caption: caption ?? media.caption,
      description: description ?? media.description,
    };

    // 🔁 IMAGE REPLACEMENT LOGIC
    if (files && files.length > 0) {
      const file = files[0];

      /* 1️⃣ Delete old image from Cloudinary */
      const oldUrl = media.url;
      const publicId = oldUrl.split("/").pop().split(".")[0];

      await cloudinary.uploader.destroy(`nexus/colleges/${publicId}`);

      /* 2️⃣ Upload new image */
      const upload = await cloudinary.uploader.upload(file.path, {
        folder: "nexus/colleges",
      });

      /* 3️⃣ Update DB url */
      updatedData.url = upload.secure_url;
    }

    await media.update(updatedData);
    return media;
  }

  /* ================= DELETE ================= */
  async remove(body) {
    const { type, id } = body;

    if (type === "city") {
      const city = await City.findByPk(id);
      if (!city) throw new Error("City not found");
      await city.destroy();
      return { message: "City deleted" };
    }

    if (type === "college") {
      const college = await College.findByPk(id);
      if (!college) throw new Error("College not found");
      await college.destroy();
      return { message: "College deleted" };
    }

    if (type === "media") {
      const media = await Media.findByPk(id);
      if (!media) throw new Error("Media not found");
      await media.destroy();
      return { message: "Media deleted" };
    }

    throw new Error("Invalid delete type");
  }
}

export default new MediaService();
