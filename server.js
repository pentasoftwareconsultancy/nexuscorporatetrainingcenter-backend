import dotenv from "dotenv";
import app from "./src/app.js";
import { sequelize } from "./src/config/db.js";
import { setupAssociations } from "./src/models/comman/associations.js";
import { setupUserTestHooks } from "./src/hooks/userTest.hooks.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Connect DB
    await sequelize.authenticate();
    // console.log("MySQL connected successfully!");

    // Setup associations ONCE
    setupAssociations();
    setupUserTestHooks();

    // Sync database ONLY ONE TIME
    await sequelize.sync({ alter: false }); // <-- NO alter, NO force
    // console.log("Database synced successfully!");

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
