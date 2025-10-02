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
  saveTable,
  getTables,
  deleteTable,
  getPatientEMR,
} = require("../../controllers/IPD/ipdPatientEMRController");

const router = express.Router();

router.get("/table/:patientId", getTables); // Get all tables

/**
 * -------------------------
 * Paragraph Routes
 * -------------------------
 */

// Get all paragraphs for a patient
router.get("/paragraph/:patientId", getParagraphs);

// Add a new paragraph
router.post("/paragraph/add", addParagraph);

// Edit a paragraph by ID
router.put("/paragraph/edit/:paragraphId", editParagraph);

// Delete a paragraph by ID
router.delete("/paragraph/delete/:paragraphId", deleteParagraph);

/**
 * -------------------------
 * EMR Routes
 * -------------------------
 */

// Add a new EMR entry for a patient
router.post("/add", addEMR);

// Delete an EMR entry by patientId + emrId
router.delete("/delete/:patientId/:emrId", deleteEMR);

// Get EMR by patientId and subFormId
router.get("/:patientId", getEMRByPatientId);

/**
 * -------------------------
 * Emoji Routes
 * -------------------------
 */

// Add an emoji entry for a patient
router.post("/emoji/add", addEmoji);

// Get all emojis for a patient + subFormId
router.get("/emoji/:patientId/:subFormId", getEmojisByPatientId);

// Delete an emoji entry by patientId + emojiId
router.delete("/emoji/delete/:patientId/:emojiId", deleteEmoji);

/**
 * -------------------------
 * Table Routes
 * -------------------------
 */
router.post("/table/save", saveTable); // Save or update table
router.delete("/table/delete/:patientId/:tableId", deleteTable); // Delete table

module.exports = router;
