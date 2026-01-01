import contactService from "../../services/contact/contact.service.js";

const contactController = {

    // Create a new contact entry
    async createContact(req, res) {
        try {
            const contact = await contactService.createContact(req.body);
            res.status(201).json(contact);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Retrieve all contact entries
    async getAllContacts(req, res) {
        try {
            const contacts = await contactService.getAllContacts();
            res.status(200).json(contacts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Retrieve a contact entry by ID
    async getContactById(req, res) {
        try {
            const contact = await contactService.getContactById(req.params.id);
            if (!contact) {
                return res.status(404).json({ message: "Contact not found" });
            }
            res.status(200).json(contact);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Delete a contact entry by ID
    async deleteContact(req, res) {
        try {
            await contactService.deleteContact(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

export default contactController;