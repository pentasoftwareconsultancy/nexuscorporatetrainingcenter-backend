import express from "express";
import cors from "cors"; 

import authRoutes from "./routes/users/auth.routes.js";
import { protect } from "./middlewares/auth.middleware.js";
import master from "./routes/master/master.route.js";
import media from "./routes/media/media.route.js";
import eventRoutes from "./routes/events/event.route.js";
import testRoutes from "./routes/test/test.route.js";
import uploadRoutes from "./routes/uploads/video.routes.js";
import placementRoutes from "./routes/comman/placement.routes.js";
import facultyRoutes from "./routes/faculty/faculty.routes.js";
import reviewRoutes from "./routes/reviews/review.route.js";

const app = express();

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Add CORS middleware BEFORE routes
app.use(
  cors({
    origin: "http://localhost:5173", // your React frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // only if you use cookies
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/master", master);
app.use("/api/media", media);
app.use("/api/events", eventRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/placement", placementRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/api/user/profile", protect, (req, res) => {
  res.json({ message: "Welcome to your profile!", userId: req.user.id });
});

export default app;
