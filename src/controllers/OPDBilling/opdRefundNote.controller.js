const OpdRefundNote = require("../../models/OPDBilling/OPDRefund.model");

// Controller to generate the next refund number
exports.getNextRefundNumber = async (req, res) => {
  try {
    const refundCount = await OpdRefundNote.countDocuments();
    const nextNumber = refundCount + 1;
    const refundNumber = `RR${nextNumber.toString().padStart(2, "0")}`;

    res.status(200).json({ refundNumber });
  } catch (err) {
    console.error("Error generating next refund number:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createRefundNote = async (req, res) => {
  try {
    const {
      patientId,
      opdId,
      refundAmount,
      refundReason,
      paymentMode,
      createdBy,
      receiptId,
      refundNumber,
    } = req.body;

    if (
      !patientId ||
      !refundAmount ||
      !refundReason ||
      !paymentMode ||
      !receiptId ||
      !refundNumber
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // // Get the count of existing refund notes
    // const refundCount = await OpdRefundNote.countDocuments();
    // const nextNumber = refundCount + 1;
    // const refundNumber = `RR${nextNumber.toString().padStart(2, "0")}`;

    const refundNote = new OpdRefundNote({
      patientId,
      opdId,
      refundAmount,
      refundReason,
      paymentMode,
      createdBy,
      receiptId,
      refundNumber,
    });
    console.log("");

    await refundNote.save();
    res.status(201).json({
      success: true,
      message: "Refund Note created successfully",
      data: refundNote,
    });
  } catch (err) {
    console.error("Error creating refund note:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getRefundNote = async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await OpdRefundNote.find({ patientId: id })
      .populate("receiptId")
      .populate("patientId")
      .populate("opdId");

    if (!notes) {
      return res.status(404).json("Not found");
    }
    return res.status(200).json({ notes });
  } catch (err) {}
};

exports.updateRefundNoteStatus = async (req, res) => {
  const { refundNoteId } = req.params;
  const { status } = req.body;
  console.log("hii");
  console.log("id and status: ", refundNoteId, status);

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid Status" });
  }
  try {
    const updated = await OpdRefundNote.findByIdAndUpdate(
      refundNoteId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "refund Note not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating the refund note status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
