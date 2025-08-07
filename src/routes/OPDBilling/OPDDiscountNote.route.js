const express = require("express");
const OPDDiscountNoteRouter = express.Router();

const {
  createDiscountNote,
  getDiscountNote,
  updateDiscountNoteStatus,
  getNextDiscountNumber,
  deleteDiscountNote,
} = require("../../controllers/OPDBilling/OPDDiscountNote.controller");

OPDDiscountNoteRouter.get("/next-discount-number", getNextDiscountNumber);
OPDDiscountNoteRouter.post("/", createDiscountNote);
OPDDiscountNoteRouter.get("/:id", getDiscountNote);
OPDDiscountNoteRouter.put("/status/:discountNoteId", updateDiscountNoteStatus);
OPDDiscountNoteRouter.delete("/:id", deleteDiscountNote);

module.exports = OPDDiscountNoteRouter;
