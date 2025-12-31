import Review from "../../models/reviews/review.model.js";
import cloudinary from "../../config/cloudinary.js";

export const reviewService = {
  // Create a new review
  async create(body, files) {
    let imageUrl = null;

    if (files && files.length > 0) {
      const upload = await cloudinary.uploader.upload(files[0].path, {
        folder: "nexus/googleReviews",
      });
      imageUrl = upload.secure_url;
    }

    const rating = Number(body.rating);

    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    return await Review.create({
      name: body.name,
      position: body.position,
      review: body.review,
      rating,
      imageUrl,
    });
  },

  // Get all reviews
  async getAll() {
    return await Review.findAll({
      order: [["createdAt", "DESC"]],
    });
  },

  // Get a review by ID
  async gitById(id) {
    const review = await Review.findByPk(id);
    if (!review) throw new Error("Review not found");
    return review;
  },

  // Update a review by ID
  async update(id, body, files) {
    const review = await Review.findByPk(id);
    if (!review) throw new Error("Review not found");

    let updateData = {
      name: body.name ?? review.name,
      position: body.position ?? review.position,
      review: body.review ?? review.review,
      rating: review.rating,
    };

    if (body.rating !== undefined) {
      const rating = Number(body.rating);
      if (!rating || rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }
      updateData.rating = rating;
    }

    if (files && files.length > 0) {
      const upload = await cloudinary.uploader.upload(files[0].path, {
        folder: "nexus/googleReviews",
      });
      updateData.imageUrl = upload.secure_url;
    }

    await review.update(updateData);
    return review;
  },

  // Delete a review by ID
  async remove(id) {
    const review = await Review.findByPk(id);
    if (!review) throw new Error("Review not found");

    await review.destroy();
    return { message: "Review deleted successfully" };
  },
};
