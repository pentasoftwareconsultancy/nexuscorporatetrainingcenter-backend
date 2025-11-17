import dotenv from "dotenv";

import app from "./src/app.js";
import { sequelize } from "./src/config/db.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log(" MySQL connected successfully!");

    await sequelize.sync({ alter: true });
    console.log(" Database tables synced");

    app.listen(PORT, (err) => console.log(` Server running on port ${PORT}` , err));
  } catch (error) {
    console.error(" DB Connection Error:", error);
  }
};

startServer();
