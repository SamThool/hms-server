const express = require("express");
const router = express.Router();

const {
  addForm,
  getAllForms,
  deleteForm,
  reorderSubforms,
} = require("../../controllers/IPD/ipdform.controller");

// POST → Add new IPD Form
router.post("/add", addForm);

// GET → Get all IPD Forms
router.get("/", getAllForms);

// DELETE → Delete IPD Form
router.delete("/delete/:id", deleteForm);

// PUT → Reorder subforms
router.put("/:id/reorder-subforms", reorderSubforms); // 👈 new route

module.exports = router;
