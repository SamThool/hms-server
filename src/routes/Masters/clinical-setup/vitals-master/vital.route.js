const { Router } = require("express");
const vitalMasterRoute = Router();
const { handleToken } = require("../../../../utils/handleToken");
const {
  createVitals,
  getAllVitals,
  getSingleVital,
  updateVitals,
  deleteVitals,
} = require("../../../../controllers/Masters/clinical-setup/vitals-master/vitals.controller");

vitalMasterRoute.route("/").post(handleToken, createVitals);
vitalMasterRoute.route("/").get(handleToken, getAllVitals);
vitalMasterRoute.route("/:id").get(handleToken, getSingleVital);
vitalMasterRoute.route("/edit/:id").put(handleToken, updateVitals);
vitalMasterRoute.route("/delete/:id").delete(handleToken, deleteVitals);

module.exports = vitalMasterRoute;
