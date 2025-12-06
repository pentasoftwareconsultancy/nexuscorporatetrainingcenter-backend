import cloudinary from "../../config/cloudinary.js";
import Video from "../../models/uploads/video.model.js";

export const videoService = {
  /* ========== CREATE VIDEO ========== */
  async createVideo(data, filePath) {
    let uploadedImage = null;

    if (filePath) {
      uploadedImage = await cloudinary.uploader.upload(filePath, {
        folder: "nexus/videos",
      });
    }

    return await Video.create({
      caption: data.caption,
      about: data.about,
      videoUrl: data.videoUrl,
      image: uploadedImage?.secure_url || null,
      cloudinaryId: uploadedImage?.public_id || null,
    });
  },

  /* ========== GET ALL VIDEOS ========== */
  async getAllVideos() {
    return await Video.findAll({
      order: [["video_id", "DESC"]],
    });
  },

  /* ========== GET ONE VIDEO ========== */
  async getVideo(id) {
    return await Video.findByPk(id);
  },

  /* ========== UPDATE VIDEO ========== */
  async updateVideo(id, newData, newFilePath) {
    const video = await Video.findByPk(id);
    if (!video) return null;

    let updatedImageUrl = video.image;
    let updatedCloudId = video.cloudinaryId;

    // If new image uploaded
    if (newFilePath) {
      // delete old image from cloudinary
      if (video.cloudinaryId) {
        await cloudinary.uploader.destroy(video.cloudinaryId);
      }

      // upload new image
      const newUploaded = await cloudinary.uploader.upload(newFilePath, {
        folder: "nexus/videos",
      });

      updatedImageUrl = newUploaded.secure_url;
      updatedCloudId = newUploaded.public_id;
    }

    await video.update({
      caption: newData.caption ?? video.caption,
      about: newData.about ?? video.about,
      videoUrl: newData.videoUrl ?? video.videoUrl,
      image: updatedImageUrl,
      cloudinaryId: updatedCloudId,
    });

    return video;
  },

  /* ========== DELETE VIDEO ========== */
  async deleteVideo(id) {
    const video = await Video.findByPk(id);
    if (!video) return null;

    // Delete from cloudinary
    if (video.cloudinaryId) {
      await cloudinary.uploader.destroy(video.cloudinaryId);
    }

    await video.destroy();
    return true;
  },
};
