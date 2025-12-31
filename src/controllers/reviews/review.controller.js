import { reviewService } from "../../services/reviews/review.service.js";

const reviewController = {
  async create(req, res) {
    try {
      const data = await reviewService.create(req.body, req.files);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const data = await reviewService.getAll();
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async gitById(req, res) {
    try {
      const data = await reviewService.gitById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const data = await reviewService.update(
        req.params.id,
        req.body,
        req.files
      );
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const data = await reviewService.remove(req.params.id);
      res.json({ success: true, message: data.message });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};

export default reviewController;
