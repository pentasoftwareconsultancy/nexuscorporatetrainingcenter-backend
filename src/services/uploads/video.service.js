import Video from "../../models/uploads/video.model.js";
import fs from "fs";
import path from "path";

export const videoService = {
  // CREATE VIDEO
  async createVideo(data) {
    return await Video.create(data);
  },

  // GET ALL VIDEOS
  async getAllVideos() {
    return await Video.findAll({
      order: [["video_id", "DESC"]],
    });
  },

  // GET ONE VIDEO
  async getVideo(id) {
    return await Video.findByPk(id);
  },

  // UPDATE VIDEO
  async updateVideo(id, newData, newImage) {
    const video = await Video.findByPk(id);
    if (!video) return null;

    // Delete old image if new image uploaded
    if (newImage && video.image) {
      const oldPath = path.join("uploads/video", video.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await video.update({
      caption: newData.caption || video.caption,
      about: newData.about || video.about,
      videoUrl: newData.videoUrl || video.videoUrl,
      image: newImage ? newImage : video.image,
    });

    return video;
  },

  // DELETE VIDEO
  async deleteVideo(id) {
    const video = await Video.findByPk(id);

    if (!video) return null;

    // Remove image file
    const imgPath = path.join("uploads/video", video.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    await video.destroy();
    return true;
  },
};
