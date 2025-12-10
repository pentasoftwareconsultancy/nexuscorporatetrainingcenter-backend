import cloudinary from "../../config/cloudinary.js";
import Faculty from "../../models/faculty/faculty.models.js";

class FacultyService {
  /* CREATE */
  async createFaculty(data, filePath) {
    let uploadedImage = null;

    if (filePath) {
      uploadedImage = await cloudinary.uploader.upload(filePath, {
        folder: "nexus/faculty",
      });
    }

    return await Faculty.create({
      faculty_name: data.faculty_name,
      experience: data.experience,
      designation: data.designation,
      skills: data.skills,
      image: uploadedImage?.secure_url || null,
      cloudinaryId: uploadedImage?.public_id || null,
    });
  }

  /* GET ALL */
  async getAllFaculty() {
    return await Faculty.findAll({ order: [["createdAt", "DESC"]] });
  }

  /* GET BY ID */
  async getFacultyById(id) {
    return await Faculty.findByPk(id);
  }

  /* UPDATE */
  async updateFaculty(id, newData, newFilePath) {
    const faculty = await Faculty.findByPk(id);
    if (!faculty) return null;

    let updatedImage = faculty.image;
    let updatedCloudId = faculty.cloudinaryId;

    if (newFilePath) {
      if (faculty.cloudinaryId) {
        await cloudinary.uploader.destroy(faculty.cloudinaryId);
      }

      const newUploaded = await cloudinary.uploader.upload(newFilePath, {
        folder: "nexus/faculty",
      });

      updatedImage = newUploaded.secure_url;
      updatedCloudId = newUploaded.public_id;
    }

    await faculty.update({
      faculty_name: newData.faculty_name ?? faculty.faculty_name,
      experience: newData.experience ?? faculty.experience,
      designation: newData.designation ?? faculty.designation,
      skills: newData.skills ?? faculty.skills,
      image: updatedImage,
      cloudinaryId: updatedCloudId,
    });

    return faculty;
  }

  /* DELETE */
  async deleteFaculty(id) {
    const faculty = await Faculty.findByPk(id);
    if (!faculty) return null;

    if (faculty.cloudinaryId) {
      await cloudinary.uploader.destroy(faculty.cloudinaryId);
    }

    await faculty.destroy();
    return true;
  }
}

export default new FacultyService();
