import {
  Event,
  EventImage,
  EventStories,
} from "../../models/events/event.models.js";
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
      order: [["id", "DESC"]],
      include: [{ model: EventImage, as: "images" }],
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
  async uploadEventImages(files, body) {
    const uploadedImages = [];

    for (const file of files) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: "nexus_events",
      });

      const image = await EventImage.create({
        url: uploaded.secure_url,
        caption: body.caption || null,
        eventId: body.eventId,
      });

      uploadedImages.push(image.toJSON());
    }

    return uploadedImages;
  }

  // ------------------- DELETE EVENT IMAGE -------------------
  async deleteEventImage(id) {
    const img = await EventImage.findByPk(id);
    if (!img) throw new Error("Event image not found");

    await img.destroy();
    return { message: "Event image deleted" };
  }

  // ------------------- EVENT STORIES -------------------
  async createStory(file, body) {
    if (!file) throw new Error("Image is required");

    const uploaded = await cloudinary.uploader.upload(file.path, {
      folder: "event_stories",
      resource_type: "auto",
    });

    const story = await EventStories.create({
      image: uploaded.secure_url,
      eventName: body.eventName,
      date: body.date,
      location: body.location,
    });

    return story.toJSON();
  }

  async getAllStories() {
    const stories = await EventStories.findAll({ order: [["id", "DESC"]] });
    return stories.map((s) => s.toJSON());
  }

  async getStoryById(id) {
    const story = await EventStories.findByPk(id);
    if (!story) throw new Error("Story not found");
    return story.toJSON();
  }

  async updateStory(id, body, file) {
    const story = await EventStories.findByPk(id);
    if (!story) throw new Error("Story not found");

    let imageUrl = story.image;
    if (file) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: "event_stories",
        resource_type: "auto",
      });
      imageUrl = uploaded.secure_url;
    }

    await story.update({
      ...body,
      image: imageUrl,
    });

    return story.toJSON();
  }

  async deleteStory(id) {
    const story = await EventStories.findByPk(id);
    if (!story) throw new Error("Story not found");
    await story.destroy();
    return { message: "Story deleted" };
  }
}

export default new EventService();
