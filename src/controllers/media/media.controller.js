import mediaService from "../../services/media/media.service.js";

const mediaController = {
  /* ========== CITY ========== */
  createCity: async (req, res) => {
    try {
      const data = await mediaService.createCity(req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getCities: async (req, res) => {
    try {
      const data = await mediaService.getCities();
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  /* ========== COLLEGE ========== */
  createCollege: async (req, res) => {
    try {
      const data = await mediaService.createCollege(req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getCollegesByCity: async (req, res) => {
    try {
      const data = await mediaService.getCollegesByCity(req.params.cityId);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  /* ========== IMAGES ========== */
  uploadImage: async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "File required" });

      const data = await mediaService.uploadImage(
        req.body.collegeId,
        req.file.path,
        req.body.caption || null
      );

      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getImagesByCollege: async (req, res) => {
    try {
      const data = await mediaService.getImagesByCollege(req.params.collegeId);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  /* ===================== CITY ===================== */
  updateCity: async (req, res) => {
    try {
      const data = await mediaService.updateCity(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  deleteCity: async (req, res) => {
    try {
      const data = await mediaService.deleteCity(req.params.id);
      res.json({ success: true, message: data.message });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  /* ===================== COLLEGE ===================== */
  updateCollege: async (req, res) => {
    try {
      const data = await mediaService.updateCollege(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  deleteCollege: async (req, res) => {
    try {
      const data = await mediaService.deleteCollege(req.params.id);
      res.json({ success: true, message: data.message });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  /* ===================== MEDIA ===================== */
  updateMedia: async (req, res) => {
    try {
      const data = await mediaService.updateMedia(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  deleteMedia: async (req, res) => {
    try {
      const data = await mediaService.deleteMedia(req.params.id);
      res.json({ success: true, message: data.message });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },
};

export default mediaController;
