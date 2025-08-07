const express=require("express");
const CarePlanRouter=express.Router();

const {createNursePlan,getAllCarePlan,GetMostUsedCarePlan,updateOtherCarePlan,deleteCarePlanByIds,
    deleteOtherCarePlan, deleteOthersCarePlan,editCarePlan,updateOthersCarePlan,updateCarePlan}=require("../../controllers/ipd-form-setup/carePlan.controller");
const { handleToken } = require("../../utils/handleToken");

CarePlanRouter.get("/careplan", handleToken, getAllCarePlan);
CarePlanRouter.post("/careplan", handleToken, createNursePlan);
CarePlanRouter.put(
  "/careplan/:id",
  handleToken,
  updateOtherCarePlan
);
CarePlanRouter.delete(
  "/careplan",
  handleToken,
  deleteOtherCarePlan
);
CarePlanRouter.delete(
    "/careplan/:id",
    handleToken,
    deleteCarePlanByIds,
);
CarePlanRouter.delete(
  "/careplan/inner-data/:id",
  handleToken,
  deleteOthersCarePlan
);
CarePlanRouter.put(
  "/careplan/objective/:id",
  handleToken,
  updateOthersCarePlan
);
CarePlanRouter.put(
  "/careplan/objective-data/:id",
  handleToken,
  updateCarePlan
);
CarePlanRouter.put(
  "/careplan/inner-data/objective-data/:id",
  handleToken,
  editCarePlan
);
CarePlanRouter.get(
  "/careplan/most-used/:id",
  handleToken,
  GetMostUsedCarePlan
);
module.exports=CarePlanRouter