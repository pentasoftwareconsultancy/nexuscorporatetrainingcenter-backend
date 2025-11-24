import eventService from "../../services/events/event.service.js";

const eventController = {
  createEvent: async (req, res) => {
    try {
      const data = await eventService.createEvent(req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getAllEvents: async (req, res) => {
    try {
      const data = await eventService.getAllEvents();
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getEventById: async (req, res) => {
    try {
      const data = await eventService.getEventById(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const data = await eventService.updateEvent(req.params.id, req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const data = await eventService.deleteEvent(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  uploadEventImage: async (req, res) => {
    try {
      const data = await eventService.uploadEventImage(req.file, req.body);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  deleteEventImage: async (req, res) => {
    try {
      const data = await eventService.deleteEventImage(req.params.id);
      res.json({ success: true, data });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};

export default eventController;
