import mediaService from "../../services/media/media.service.js";

const mediaController = {
  /* CREATE */
  handleCreate: async (req, res) => {
    try {
      const data = await mediaService.create(req.body, req.files);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  /* GET */
  handleGet: async (req, res) => {
    try {
      const data = await mediaService.get(req.query);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  /* UPDATE */
  handleUpdate: async (req, res) => {
    try {
      const data = await mediaService.update(req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  /* DELETE */
  handleDelete: async (req, res) => {
    try {
      const data = await mediaService.remove(req.body);
      res.json({ success: true, message: data.message });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};

export default mediaController;
