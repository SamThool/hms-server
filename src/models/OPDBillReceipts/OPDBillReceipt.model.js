const mongoose = require("mongoose");

const OPDBillReceiptSchema = new mongoose.Schema(
  {
    receiptNo: { type: String, default: "" },
    tokenNo: { type: Number, default: 0 },
    opdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OPD_patient",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient_Appointment",
    },
    services: { type: Array },
    charges: { type: Number, default: 0 },
    transactionId: { type: String, default: null },
    cardNo: { type: String, default: null },
    cardPersonName: { type: String, default: null },
    discountCharges: { type: Number, default: 0 },
    discountStatus: {
      type: String,
      enum: ["pending", "approved"],
      default: "approved",
    },
    discountNoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OPD_discount_note",
      default: null,
    },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    payType: { type: String, default: null },
    paymentMode: { type: String, default: null },
    paymentModeId: { type: String, ref: "PaymentMode", default: null },
    invoiceNo: { type: String },
    billNo: { type: String },
    billDate: { type: String },
    personWhoCreatedThisBillName: { type: String, default: "" },
    personWhoCreatedThisBillId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    personWhoCreatedThisBillRefType: { type: String, default: "" },
    employeeCode: { type: String, default: "" },

    // ✅ New cheque fields
    chequeNumber: { type: String, default: null },
    chequeDate: { type: String, default: null },
    chequeBank: { type: String, default: null },
    chequeAmount: { type: Number, default: 0 },
    utrNumber: { type: String, default: null }, // ✅ New field for UPI UTR Number

    delete: { type: Boolean, default: false },
    deleteAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const OPDReceiptModel = mongoose.model("Opd_Receipt", OPDBillReceiptSchema);
module.exports = OPDReceiptModel;
