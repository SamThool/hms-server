const express = require("express");
const router = express.Router();
const {
  createSubform,
  updateSubform,
  deleteSubform,
  getSubformsByFormId,
  addImageToSubform,
  getImageToSubform,
} = require("../../controllers/IPD/ipdsubform.controller");

router.post("/", createSubform); // Create Subform
router.put("/:id", updateSubform); // Update Subform name
router.delete("/:id", deleteSubform); // Delete Subform
router.get("/form/:formId", getSubformsByFormId); // Get all Subforms by formId
// ✅ Add image to subform
router.post("/:id/add-image", addImageToSubform);

// GET /subform/:id/images
router.get("/:id/images", getImageToSubform);

module.exports = router;
