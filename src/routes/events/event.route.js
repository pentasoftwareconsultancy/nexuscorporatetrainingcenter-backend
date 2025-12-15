import express from "express";
import multer from "multer";
import { protect } from "../../middlewares/auth.middleware.js";
import eventController from "../../controllers/events/event.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// EVENTS
router.post("/", protect, eventController.createEvent);
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.put("/:id", protect, eventController.updateEvent);
router.delete("/:id", protect, eventController.deleteEvent);

// EVENT IMAGES
router.post(
  "/upload",
  protect,
  upload.single("file"),
  eventController.uploadEventImage
);
router.delete("/image/:id", protect, eventController.deleteEventImage);

// ------------------- EVENT STORIES -------------------
router.post("/stories", protect, upload.single("file"), eventController.createStory);
router.get("/stories", eventController.getAllStories);
router.get("/stories/:id", eventController.getStoryById);
router.put("/stories/:id", protect, upload.single("file"), eventController.updateStory);
router.delete("/stories/:id", protect, eventController.deleteStory);

export default router;
