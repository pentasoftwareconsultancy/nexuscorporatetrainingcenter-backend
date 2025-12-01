import placementService from "../../services/comman/placement.service.js";

/* ------------ CREATE ------------ */
export const createPlacement = async (req, res) => {
  try {
    const data = await placementService.createPlacement(req.body);
    res.status(201).json({ message: "Placement added successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Error creating placement", error });
  }
};

/* ------------ GET ALL ------------ */
export const getAllPlacements = async (req, res) => {
  try {
    const search = req.query.search || "";
    const result = await placementService.getAllPlacements(
      search,
      req.limit,
      req.offset
    );

    res.json({
      page: req.page,
      limit: req.limit,
      total: result.total,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving placements", error });
  }
};

/* ------------ BASIC LIST ------------ */
export const getBasicPlacements = async (req, res) => {
  try {
    const result = await placementService.getBasicPlacementList(
      req.query,
      req.limit,
      req.offset
    );

    res.json({
      page: req.page,
      limit: req.limit,
      total: result.total,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching basic placements", error });
  }
};

/* ------------ MINIMAL ------------ */
export const getMinimalPlacements = async (req, res) => {
  try {
    const search = req.query.search || "";
    const data = await placementService.getMinimalPlacements(search);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching minimal placements", error });
  }
};

/* ------------ STATS ------------ */
export const getPlacementStats = async (req, res) => {
  try {
    const data = await placementService.getPlacementStats();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
};

/* ------------ GET BY ID ------------ */
export const getPlacementById = async (req, res) => {
  try {
    const data = await placementService.getPlacementById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving placement", error });
  }
};

/* ------------ UPDATE ------------ */
export const updatePlacement = async (req, res) => {
  try {
    await placementService.updatePlacement(req.params.id, req.body);
    res.json({ message: "Placement updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating placement", error });
  }
};

/* ------------ DELETE ------------ */
export const deletePlacement = async (req, res) => {
  try {
    await placementService.deletePlacement(req.params.id);
    res.json({ message: "Placement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting placement", error });
  }
};
