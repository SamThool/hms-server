const express = require("express");
const router = express.Router();

const {
  getNextRefundNumber,
  createRefundNote,
  getRefundNote,
  updateRefundNoteStatus,
} = require("../../controllers/OPDBilling/opdRefundNote.controller");

router.get("/next-refund-number", getNextRefundNumber);
router.post("/", createRefundNote);
router.get("/:id", getRefundNote);
router.put("/status/:refundNoteId", updateRefundNoteStatus);

module.exports = router;
