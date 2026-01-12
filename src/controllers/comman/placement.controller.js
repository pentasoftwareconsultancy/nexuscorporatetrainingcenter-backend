import placementService from "../../services/comman/placement.service.js";

/* ---------------- CATEGORY ---------------- */
export const createCategory = async (req, res) => {
  try {
    const data = await placementService.createCategory(req.body);
    res.status(201).json({ message: "Category created", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    res.json(await placementService.getAllCategories());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    await placementService.updateCategory(req.params.id, req.body);
    res.json({ message: "Category updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await placementService.deleteCategory(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- PLACEMENTS ---------------- */

export const createPlacement = async (req, res) => {
  try {
    const filePath = req.file?.path;

    const newPlacement = await placementService.createPlacement(
      req.body,
      filePath
    );

    res.status(201).json({
      success: true,
      message: "Placement created successfully",
      data: newPlacement,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPlacements = async (req, res) => {
  try {
    const { search } = req.query;
    const data = await placementService.getAllPlacements(
      search,
      req.limit,
      req.offset
    );

    res.json({
      success: true,
      page: req.page,
      limit: req.limit,
      total: data.total,
      data: data.data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPlacementById = async (req, res) => {
  try {
    const data = await placementService.getPlacementById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePlacement = async (req, res) => {
  try {
    const filePath = req.file?.path;

    const updated = await placementService.updatePlacement(
      req.params.id,
      req.body,
      filePath
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Placement not found" });
    }

    res.json({
      success: true,
      message: "Placement updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePlacement = async (req, res) => {
  try {
    const deleted = await placementService.deletePlacement(req.params.id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Placement not found" });
    }

    res.json({ success: true, message: "Placement deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryYearWisePlacements = async (req, res) => {
  try {
    const data = await placementService.getCategoryYearWisePlacements();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- DETAILS ---------------- */
export const createPlacementDetails = async (req, res) => {
  try {
    const data = await placementService.createPlacementDetails(req.body);
    res.status(201).json({ message: "Details added", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllPlacementDetails = async (req, res) => {
  try {
    const data = await placementService.getAllPlacementDetails();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlacementDetails = async (req, res) => {
  try {
    const data = await placementService.getPlacementDetails(req.params.id);
    // console.log(data);
    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updatePlacementDetails = async (req, res) => {
  try {
    await placementService.updatePlacementDetails(req.params.id, req.body);
    res.json({ message: "Details updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFullPlacementById = async (req, res) => {
  try {
    const placement = await placementService.getFullPlacementById(
      req.params.placementId
    );

    if (!placement) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // 🔥 FLATTEN RESPONSE
    const data = {
      [placement.placement_id]: {
        placement_id: placement.placement_id,
        student_name: placement.student_name,
        company_name: placement.company_name,
        company_role: placement.company_role,
        course: placement.course,
        package: placement.package,
        image: placement.image,
        year: placement.year,

        success_story: placement.details?.success_story || null,
        facing_challenges: placement.details?.facing_challenges || null,
        program_highlights: placement.details?.program_highlights || null,
        final_evaluation: placement.details?.final_evaluation || null,
        overall_experience: placement.details?.overall_experience || null,
      },
    };

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePlacementDetails = async (req, res) => {
  try {
    await placementService.deletePlacementDetails(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- YEAR-WISE ---------------- */
export const getPlacementYearWise = async (req, res) => {
  try {
    const data = await placementService.getYearWisePlacement();
    res.json({ message: "Year-wise placement", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- ALL PLACEMENTS DETAILS ---------------- */
export const getAllPlacementData = async (req, res) => {
  try {
    const data = await placementService.getAllPlacementDataByPlacementId(
      req.params.id
    );

    if (!data) {
      return res.status(404).json({ message: "Placement not found" });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateFullPlacement = async (req, res) => {
  try {
    // console.log("========= POSTMAN DEBUG =========");
    // console.log("HEADERS:", req.headers);
    // console.log("BODY:", req.body);
    // console.log("FILE:", req.file);
    // console.log("=================================");

    const placementId = req.params.placementId;
    const filePath = req.file?.path;

    // ⭐ IMPORTANT FIX
    if (req.body.details && typeof req.body.details === "string") {
      req.body.details = JSON.parse(req.body.details);
    }

    const data = await placementService.updateFullPlacement(
      placementId,
      req.body,
      filePath
    );

    if (!data) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.status(200).json({
      success: true,
      message: "Placement updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createFullPlacement = async (req, res) => {
  try {
    // console.log("========= CREATE DEBUG =========");
    // console.log("HEADERS:", req.headers);
    // console.log("BODY:", req.body);
    // console.log("FILE:", req.file);
    // console.log("================================");

    const filePath = req.file?.path;

    // Parse details if coming as JSON string
    if (req.body.details && typeof req.body.details === "string") {
      try {
        req.body.details = JSON.parse(req.body.details);
      } catch (e) {
        // console.log("❌ DETAILS JSON PARSE FAILED");
      }
    }

    const data = await placementService.createFullPlacement(req.body, filePath);

    res.status(201).json({
      success: true,
      message: "Placement created successfully",
      data,
    });

  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFullPlacement = async (req, res) => {
  try {
    const placementId = req.params.placementId;

    const deleted = await placementService.deleteFullPlacement(placementId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Placement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Placement deleted successfully",
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
