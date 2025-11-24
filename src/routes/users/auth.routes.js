import express from "express";

import { protect } from "../../middlewares/auth.middleware.js";
import { authorizRole } from "../../middlewares/roleMiddleware.js";
import { login, signup } from "../../controllers/users/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

//Role-based routes
router.get("/admin", protect, authorizRole("admin"), (req, res) => {
  res.status(200).json({ message: "Welcome Admin!" });
});

router.get("/user", protect, authorizRole("user", "admin"), (req, res) => {
  res.status(200).json({ message: "Welcome user!" });
});

router.get(
  "/teacher",
  protect,
  authorizRole("admin", "user", "teacher"),
  (req, res) => {
    res.status(200).json({ message: "Welcome teacher!" });
  }
);

export default router;
