import express from "express";
import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js"
import categoryRoutes from "./routes/category.routes.js"
import batchRoutes from "./routes/batch.routes.js"
import quizRoutes from "./routes/quiz.routes.js"
import quizQuestionRoutes from "./routes/quiz_question.routes.js";
import quizAttemptRoutes from "./routes/quiz_attempt.routes.js";
import { protect } from "./middlewares/auth.middleware.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
import "./models/index.js";   // VERY IMPORTANT

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth Endpoints
app.use("/api/auth", authRoutes);
// app.use("/api", uploadRoutes);
app.use("/api/course", courseRoutes)
app.use('/api/category', categoryRoutes);
app.use('/api/batch', batchRoutes)
app.use('/api/quiz', quizRoutes)
app.use("/api/quiz-questions", quizQuestionRoutes);
app.use("/api/quiz-attempts", quizAttemptRoutes); 

app.get("/api/user/profile", protect, (req, res) => {
  res.json({ message: "Welcome to your profile!", userId: req.user.id });
});

export default app;
