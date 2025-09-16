const express = require("express");
const router = express.Router();

const {
  addForm,
  getAllForms,
  deleteForm,
} = require("../../controllers/IPD/ipdform.controller");

// POST → Add new IPD Form
router.post("/add", addForm);

// GET → Get all IPD Forms
router.get("/", getAllForms);

// DELETE → Delete IPD Form
router.delete("/delete/:id", deleteForm);

module.exports = router;
