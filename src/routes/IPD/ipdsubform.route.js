const express = require("express");
const router = express.Router();
const {
  createSubform,
  updateSubform,
  deleteSubform,
  getSubformsByFormId,
} = require("../../controllers/IPD/ipdsubform.controller");

router.post("/", createSubform); // Create Subform
router.put("/:id", updateSubform); // Update Subform name
router.delete("/:id", deleteSubform); // Delete Subform
router.get("/form/:formId", getSubformsByFormId); // Get all Subforms by formId

module.exports = router;
