import facultyService from "../../services/faculty/faculty.service.js";

export const createFaculty = async (req, res) => {
  try {
    const filePath = req.file?.path;
    const newFaculty = await facultyService.createFaculty(req.body, filePath);

    res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      data: newFaculty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const data = await facultyService.getAllFaculty();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFacultyById = async (req, res) => {
  try {
    const data = await facultyService.getFacultyById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const filePath = req.file?.path;
    const updated = await facultyService.updateFaculty(
      req.params.id,
      req.body,
      filePath
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    res.json({
      success: true,
      message: "Faculty updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    const deleted = await facultyService.deleteFaculty(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Faculty not found" });
    }

    res.json({ success: true, message: "Faculty deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
