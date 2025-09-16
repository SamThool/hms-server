const express = require("express");
const {
  createLayer,
  editLayer,
  deleteLayer,
  getLayersBySubform,
  addQuestion,
  addChildQuestion,
  deleteQuestion,
  editQuestion,
  editChildQuestion,
} = require("../../controllers/IPD/ipdlayers.controller");

const router = express.Router();

// Create new layer
router.post("/", createLayer);

// Edit layer docName
router.put("/:id", editLayer);

// Delete layer
router.delete("/:id", deleteLayer);

// Get all layers by subformId
router.get("/subform/:subformId", getLayersBySubform);

// Add a question to a layer
router.post("/:layerId/question", addQuestion);

// Add question inside another question
router.post("/:layerId/question/:questionId/child", addChildQuestion);

// Delete question (top-level or nested)
router.delete("/:layerId/question/:questionId", deleteQuestion);

// Edit top-level question
router.put("/:layerId/question/:questionId", editQuestion);

// Edit child question (nested)
router.put("/:layerId/question/:parentId/child/:questionId", editChildQuestion);

module.exports = router;
