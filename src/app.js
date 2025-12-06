import express from "express";

import authRoutes from "./routes/users/auth.routes.js";
import { protect } from "./middlewares/auth.middleware.js";
import master from "./routes/master/master.route.js";
import media from "./routes/media/media.route.js";
import eventRoutes from "./routes/events/event.route.js";
import testRoutes from "./routes/test/test.route.js";
import placementRoutes from "./routes/comman/placement.routes.js";
import videoRoutes from "./routes/uploads/video.routes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/master", master);
app.use("/api/media", media);
app.use("/api/events", eventRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/placements", placementRoutes);

app.get("/api/user/profile", protect, (req, res) => {
  res.json({ message: "Welcome to your profile!", userId: req.user.id });
});

app.use("/uploads", express.static("uploads"));
app.use("/api/videos", videoRoutes);


export default app;
