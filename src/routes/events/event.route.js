import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.js";
import eventController from "../../controllers/events/event.controller.js";

const router = express.Router();

// EVENTS
router.post("/gallery", protect, eventController.createEvent);
router.get("/gallery", eventController.getAllEvents);
router.get("/gallery/:id", eventController.getEventById);
router.put("/gallery/:id", protect, eventController.updateEvent);
router.delete("/gallery/:id", protect, eventController.deleteEvent);

// EVENT IMAGES (MULTIPLE FILE UPLOAD)
router.post(
  "/upload",
  protect,
  upload.array("files", 10), 
  eventController.uploadEventImage
);

router.delete("/image/:id", protect, eventController.deleteEventImage);

// ------------------- EVENT STORIES -------------------
router.post("/stories", protect, upload.single("file"), eventController.createStory);
router.get("/stories", eventController.getAllStories);
router.get("/stories-id/:id", eventController.getStoryById);
router.put("/stories/:id", protect, upload.single("file"), eventController.updateStory);
router.delete("/stories/:id", protect, eventController.deleteStory);

export default router;
