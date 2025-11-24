import { Event, EventImage } from "../../models/events/event.models.js";
import cloudinary from "../../config/cloudinary.js";

class EventService {
  // ------------------- CREATE EVENT -------------------
  async createEvent(body) {
    const event = await Event.create(body);
    return event.toJSON();
  }

  // ------------------- ALL EVENTS ---------------------
  async getAllEvents() {
    const events = await Event.findAll({
      include: [{ model: EventImage, as: "images" }],
      order: [["id", "DESC"]],
    });

    return events.map((e) => e.toJSON());
  }

  // ------------------- SINGLE EVENT -------------------
  async getEventById(id) {
    const event = await Event.findByPk(id, {
      include: [{ model: EventImage, as: "images" }],
    });

    if (!event) throw new Error("Event not found");

    return event.toJSON();
  }

  // ------------------- UPDATE EVENT -------------------
  async updateEvent(id, body) {
    const event = await Event.findByPk(id);
    if (!event) throw new Error("Event not found");

    await event.update(body);
    return event.toJSON();
  }

  // ------------------- DELETE EVENT -------------------
  async deleteEvent(id) {
    const event = await Event.findByPk(id);
    if (!event) throw new Error("Event not found");

    await event.destroy();
    return { message: "Event deleted" };
  }

  // ------------------- UPLOAD EVENT IMAGE -------------------
  async uploadEventImage(file, body) {
    if (!file) throw new Error("File is required");

    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "nexus_events",
      resource_type: "auto",
    });

    const image = await EventImage.create({
      url: uploaded.secure_url,
      caption: body.caption || null,
      eventId: body.eventId,
    });

    return image.toJSON();
  }

  // ------------------- DELETE EVENT IMAGE -------------------
  async deleteEventImage(id) {
    const img = await EventImage.findByPk(id);
    if (!img) throw new Error("Event image not found");

    await img.destroy();
    return { message: "Event image deleted" };
  }
}

export default new EventService();
