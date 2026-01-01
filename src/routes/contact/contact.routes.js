import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import contactController from "../../controllers/contact/contact.controller.js";

const router = express.Router();

    // Create a new contact entry
    router.post("/", contactController.createContact);

    // Retrieve all contact entries
    router.get("/", protect, contactController.getAllContacts);

    // Retrieve a contact entry by ID
    router.get("/:id", protect, contactController.getContactById);

    // Delete a contact entry by ID
    router.delete("/:id", protect, contactController.deleteContact);

export default router;
