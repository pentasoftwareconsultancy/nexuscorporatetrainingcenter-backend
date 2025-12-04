import { videoService } from "../../services/uploads/video.service.js";

export const createVideo = async (req, res) => {
  try {
    const { caption, about, videoUrl } = req.body;
    const image = req.file?.filename;

    if (!caption || !about || !videoUrl || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const video = await videoService.createVideo({
      caption,
      about,
      videoUrl,
      image,
    });

    res.status(201).json({
      message: "Video created successfully",
      video_id: video.video_id,
      video,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const videos = await videoService.getAllVideos();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const { caption, about, videoUrl } = req.body;

    const updated = await videoService.updateVideo(
      videoId,
      { caption, about, videoUrl },
      req.file?.filename
    );

    if (!updated)
      return res.status(404).json({ message: "Video not found" });

    res.json({ message: "Video updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const deleted = await videoService.deleteVideo(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Video not found" });

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
