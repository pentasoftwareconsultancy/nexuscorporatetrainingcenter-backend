import placementService from "../../services/comman/placement.service.js";

export const createPlacement = async (req, res) => {
  try {
    const data = await placementService.createPlacement(req.body);
    res.status(201).json({ message: "Placement added successfully", data });
  } catch (error) {
    res.status(500).json({ message: "Error creating placement", error });
  }
};

export const getAllPlacements = async (req, res) => {
  try {
    const search = req.query.search || "";
    const data = await placementService.getAllPlacements(search);
    const total = await placementService.getTotalPlacements();

    res.json({ totalPlacements: total, data });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving placements", error });
  }
};

export const getBasicPlacements = async (req, res) => {
  try {
    const data = await placementService.getBasicPlacementList();
     if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching basic placements", error });
  }
};


export const getPlacementById = async (req, res) => {
  try {
    const data = await placementService.getPlacementById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving placement", error });
  }
};

export const updatePlacement = async (req, res) => {
  try {
    await placementService.updatePlacement(req.params.id, req.body);
    res.json({ message: "Placement updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating placement", error });
  }
};

export const deletePlacement = async (req, res) => {
  try {
    await placementService.deletePlacement(req.params.id);
    res.json({ message: "Placement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting placement", error });
  }
};
