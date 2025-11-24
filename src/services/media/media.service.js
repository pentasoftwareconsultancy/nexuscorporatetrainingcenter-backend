import { Gallery, Media } from "../../models/media/media.models.js";
import cloudinary from "../../config/cloudinary.js";

class MediaService {
  // ------------------- GALLERY -------------------
  async createGallery(body) {
    const gallery = await Gallery.create(body);
    return gallery.toJSON(); // safe JSON
  }

  async getAllGalleries() {
    const galleries = await Gallery.findAll({
      include: [
        {
          model: Media,
          as: "media",
        },
      ],
      order: [["id", "DESC"]],
    });

    // CRASH FIX: convert Sequelize models to JSON
    return galleries.map((g) => g.toJSON());
  }

  async getGalleryById(id) {
    const gallery = await Gallery.findByPk(id, {
      include: [
        {
          model: Media,
          as: "media",
        },
      ],
    });

    if (!gallery) throw new Error("Gallery not found");

    return gallery.toJSON();
  }

  // ------------------- MEDIA UPLOAD -------------------
  async uploadMedia(file, body) {
    if (!file) throw new Error("File is required");

    // Upload to Cloudinary
    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "nexus_media",
      resource_type: "auto",
    });

    const media = await Media.create({
      url: uploaded.secure_url,
      type: body.type || "image",
      caption: body.caption || null,
      galleryId: body.galleryId,
    });

    return media.toJSON();
  }

  // ------------------- DELETE MEDIA -------------------
  async deleteMedia(id) {
    const media = await Media.findByPk(id);

    if (!media) throw new Error("Media not found");

    await media.destroy();

    return { message: "Media deleted successfully" };
  }
}

export default new MediaService();
