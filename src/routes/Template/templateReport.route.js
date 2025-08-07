const express = require("express");
const TemplateReport = express.Router();

const {
  createTemplateController,
  getTemplateController,
  updateTemplateController,
  deleteTemplateController,
} = require("../../controllers/Template/templateReport.controller");

// Routes for both pathology and radiology via dynamic :type
TemplateReport.post("/files", createTemplateController);
TemplateReport.get("/files", getTemplateController);
TemplateReport.put("/:id", updateTemplateController);
TemplateReport.delete("/:id", deleteTemplateController);

module.exports = TemplateReport;
