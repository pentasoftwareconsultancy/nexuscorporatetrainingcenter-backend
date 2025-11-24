import mediaService from "../../services/media/media.service.js";
import { cacheStore } from "../../utils/cache.js";

const mediaController = {
  createGallery: async (req, res) => {
    try {
      const data = await mediaService.createGallery(req.body);
      cacheStore.del("galleries");
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getAllGalleries: async (req, res) => {
    try {
      const data = await mediaService.getAllGalleries();
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getGalleryById: async (req, res) => {
    try {
      const data = await mediaService.getGalleryById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  uploadMedia: async (req, res) => {
    try {
      const data = await mediaService.uploadMedia(req.file, req.body);
      cacheStore.del("galleries");
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteMedia: async (req, res) => {
    try {
      const data = await mediaService.deleteMedia(req.params.id);
      cacheStore.del("galleries");
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};

export default mediaController;
