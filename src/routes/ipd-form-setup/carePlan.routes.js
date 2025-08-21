const express = require("express");
const CarePlanRouter = express.Router();

const {
  createNursePlan,
  getAllCarePlan,
  GetMostUsedCarePlan,
  updateOtherCarePlan,
  deleteCarePlanByIds,
  deleteOtherCarePlan,
  deleteOthersCarePlan,
  editCarePlan,
  updateOthersCarePlan,
  updateCarePlan
} = require("../../controllers/ipd-form-setup/carePlan.controller");

const { handleToken } = require("../../utils/handleToken");

// GET routes
CarePlanRouter.get("/careplan", handleToken, getAllCarePlan);
CarePlanRouter.get("/careplan/most-used/:id", handleToken, GetMostUsedCarePlan);

// POST routes
CarePlanRouter.post("/careplan", handleToken, createNursePlan);

// PUT routes
CarePlanRouter.put("/careplan/:id", handleToken, updateOtherCarePlan);
CarePlanRouter.put("/careplan/subHeading-data/:id", handleToken, updateOthersCarePlan); // For updating subHeading data
CarePlanRouter.put("/careplan/inner-data/subHeading-data/:id", handleToken, editCarePlan); // For updating inner data
CarePlanRouter.put("/careplan/objective-data/:id", handleToken, updateCarePlan);

// DELETE routes
// IMPORTANT: Order matters! More specific routes should come first
CarePlanRouter.delete("/careplan/bulk", handleToken, deleteCarePlanByIds); // For bulk deletion
CarePlanRouter.delete("/careplan/inner-data/:id", handleToken, deleteOthersCarePlan); // For deleting inner data
CarePlanRouter.delete("/careplan/:id", handleToken, deleteOtherCarePlan); // For deleting subHeading data

module.exports = CarePlanRouter;