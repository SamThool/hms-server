// routes/ipdPatientEMR.js
const express = require("express");
const {
  addEMR,
  deleteEMR,
  getEMRByPatientId,
} = require("../../controllers/IPD/ipdPatientEMRController");

const router = express.Router();

// Add EMR entry for patient
router.post("/add", addEMR);

// Delete EMR entry by patientId + emrId
router.delete("/delete/:patientId/:emrId", deleteEMR);

// Get EMR by PatientId
router.get("/:patientId", getEMRByPatientId);

module.exports = router;
