const OpdDiscountNote = require("../../models/OPDBilling/OPDDiscount.model");

// Controller to generate the next refund number
exports.getNextDiscountNumber = async (req, res) => {
  try {
    const discountCount = await OpdDiscountNote.countDocuments();
    const nextNumber = discountCount + 1;
    const discountNumber = `DD${nextNumber.toString().padStart(2, "0")}`;

    res.status(200).json({ discountNumber });
  } catch (err) {
    console.error("Error generating next discount number:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createDiscountNote = async (req, res) => {
  try {
    const {
      patientId,
      opdId,
      discountAmount,
      discountReason,
      paymentMode,
      createdBy,
      discountNumber,
    } = req.body;

    if (
      !patientId ||
      !discountAmount ||
      !discountReason ||
      !paymentMode ||
      !discountNumber
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // // Get the count of existing refund notes
    // const refundCount = await OpdRefundNote.countDocuments();
    // const nextNumber = refundCount + 1;
    // const refundNumber = `RR${nextNumber.toString().padStart(2, "0")}`;

    const discountNote = new OpdDiscountNote({
      patientId,
      opdId,
      discountAmount,
      discountReason,
      paymentMode,
      createdBy,
      discountNumber,
    });

    await discountNote.save();
    res.status(201).json({
      success: true,
      message: "discount Note created successfully",
      data: discountNote,
    });
  } catch (err) {
    console.error("Error creating discount note:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDiscountNote = async (req, res) => {
  try {
    console.log("reached");
    console.log("discountnote id", req.params.id);

    const { id } = req.params;
    const notes = await OpdDiscountNote.findById(id);

    if (!notes) {
      const notes = await OpdDiscountNote.find({ patientId: id })
        .populate("patientId")
        .populate("opdId");
      return res.status(200).json({ notes });
    }
    return res.status(200).json({ notes });
  } catch (err) {
    res.status(404).json("Not found");
    console.log(err);
  }
};

exports.updateDiscountNoteStatus = async (req, res) => {
  const { discountNoteId } = req.params;
  const { status } = req.body;
  console.log("hii");
  console.log("id and status: ", discountNoteId, status);

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid Status" });
  }
  try {
    const updated = await OpdDiscountNote.findByIdAndUpdate(
      discountNoteId,
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
    console.error("Error updating the discount note status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteDiscountNote = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNote = await OpdDiscountNote.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Discount note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Discount note deleted successfully",
      data: deletedNote,
    });
  } catch (error) {
    console.error("❌ Error deleting discount note:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
