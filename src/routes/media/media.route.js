import express from "express";
import multer from "multer";
import mediaController from "../../controllers/media/media.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/*
  ONE API FOR EVERYTHING
*/

router.post(
  "/CreateMedia",
  upload.array("files", 10),
  mediaController.handleCreate
);

router.get("/GetMedia", mediaController.handleGet);

router.put(
  "/UpdateMedia",
  protect,
  upload.array("files", 1),
  mediaController.handleUpdate
);

router.delete("/DeleteMedia", protect, mediaController.handleDelete);

export default router;
