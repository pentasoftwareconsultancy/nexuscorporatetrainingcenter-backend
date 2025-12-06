import { videoService } from "../../services/uploads/video.service.js";

const videoController = {
  /* ===================== CREATE VIDEO ===================== */
  createVideo: async (req, res) => {
    try {
      const { caption, about, videoUrl } = req.body;

      if (!caption || !about || !videoUrl) {
        return res.status(400).json({
          success: false,
          message: "caption, about, videoUrl are required",
        });
      }

      const filePath = req.file?.path;
      if (!filePath) {
        return res.status(400).json({
          success: false,
          message: "Thumbnail image is required",
        });
      }

      const video = await videoService.createVideo(
        { caption, about, videoUrl },
        filePath
      );

      res.status(201).json({
        success: true,
        message: "Video created successfully",
        video_id: video.video_id,
        data: video,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /* ===================== GET ALL ===================== */
  getAllVideos: async (req, res) => {
    try {
      const videos = await videoService.getAllVideos();
      res.json({ success: true, data: videos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /* ===================== UPDATE ===================== */
  updateVideo: async (req, res) => {
    try {
      const videoId = req.params.id;
      const { caption, about, videoUrl } = req.body;

      const filePath = req.file?.path; // Cloudinary upload (optional)

      const updated = await videoService.updateVideo(
        videoId,
        { caption, about, videoUrl },
        filePath
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Video not found",
        });
      }

      res.json({
        success: true,
        message: "Video updated successfully",
        data: updated,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /* ===================== DELETE ===================== */
  deleteVideo: async (req, res) => {
    try {
      const deleted = await videoService.deleteVideo(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Video not found",
        });
      }

      res.json({
        success: true,
        message: "Video deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default videoController;
