import { Contact } from "../../models/contact/contact.model.js";

class ContactService {
    // Create a new contact entry
    async createContact(data) {
        try {
            const contact = await Contact.create(data);
            return contact;
        } catch (error) {
            throw new Error("Error creating contact: " + error.message);
        }
    }

    // Retrieve all contact entries
    async getAllContacts() {
        try {
            const contacts = await Contact.findAll();
            return contacts;
        } catch (error) {
            throw new Error("Error retrieving contacts: " + error.message);
        }
    }

    // Retrieve a contact entry by ID
    async getContactById(id) {
        try {
            const contact = await Contact.findByPk(id);
            return contact;
        } catch (error) {
            throw new Error("Error retrieving contact: " + error.message);
        }
    }

    // Delete a contact entry by ID
    async deleteContact(id) {
        try {
            const contact = await Contact.findByPk(id);
            if (!contact) {
                throw new Error("Contact not found");
            }
            await contact.destroy();
            return true;
        } catch (error) {
            throw new Error("Error deleting contact: " + error.message);
        }
    }
}

export default new ContactService();