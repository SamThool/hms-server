// routes/ipdPatientEMR.js
const express = require("express");
const {
  addEMR,
  deleteEMR,
  getEMRByPatientId,
  addEmoji,
  getEmojisByPatientId,
  deleteEmoji,
  addParagraph,
  getParagraphs,
  editParagraph,
  deleteParagraph,
} = require("../../controllers/IPD/ipdPatientEMRController");

const router = express.Router();

// Add EMR entry for patient
router.post("/add", addEMR);

// Add Emoji entry for patient
router.post("/emoji/add", addEmoji);

// Delete EMR entry by patientId + emrId
router.delete("/delete/:patientId/:emrId", deleteEMR);

// Get EMR by PatientId
router.get("/:patientId", getEMRByPatientId);

// Get all emojis for a patient
router.get("/emoji/:patientId", getEmojisByPatientId);

// routes/ipdPatientEMR.js
router.delete("/emoji/delete/:patientId/:emojiId", deleteEmoji);

// Paragraph routes
router.post("/paragraph/add", addParagraph);
router.get("/paragraph/:patientId", getParagraphs);
router.put("/paragraph/edit/:paragraphId", editParagraph);
router.delete("/paragraph/delete/:paragraphId", deleteParagraph);

module.exports = router;
