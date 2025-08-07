// routes/subDepartment.routes.js
const express = require("express");
const router = express.Router();
const {
  getAllSubDepartments,
  createSubDepartment,
  updateSubDepartment,
  deleteSubDepartment,
  bulkImport,
} = require("../../../controllers/Masters/subDepartment/subdepartment");

// GET
router.get("/", getAllSubDepartments);

// POST
router.post("/", createSubDepartment);

// PUT
router.put("/:id", updateSubDepartment);

// DELETE
router.delete("/:id", deleteSubDepartment);
router.post("/import", bulkImport);

module.exports = router;
