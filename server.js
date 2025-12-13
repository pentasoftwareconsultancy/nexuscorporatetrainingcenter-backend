import dotenv from "dotenv";
import app from "./src/app.js";
import { sequelize } from "./src/config/db.js";
import cross from "cors"; // ✅ CORS import
import { setupAssociations } from "./src/models/comman/associations.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

// ✅ Add CORS here before app.listen
app.use(
  cross({
    origin: "http://localhost:5173", // your React frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // only needed if you use cookies
  })
);

const start = async () => {
  try {
    // Connect DB
    await sequelize.authenticate();
    console.log("MySQL connected successfully!");
    
    // Setup associations ONCE
    setupAssociations();
    
    // Sync database ONLY ONE TIME
    await sequelize.sync({alter :false}); // <-- NO alter, NO force
    console.log("Database synced successfully!");
    
    // Start server ONE TIME
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("App initialized with CORS and routes.");
    });
  } catch (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
};

start();
