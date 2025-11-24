import dotenv from "dotenv";
import app from "./src/app.js";
import { sequelize } from "./src/config/db.js";
import { setupAssociations } from "./src/models/comman/associations.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Connect DB
    await sequelize.authenticate();
    console.log("MySQL connected successfully!");

    // Setup associations ONCE
    setupAssociations();

    // Sync database ONLY ONE TIME
    await sequelize.sync(); // <-- NO alter, NO force
    console.log("Database synced successfully!");

    // Start server ONE TIME
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server startup error:", err);
    process.exit(1);
  }
};

start();
