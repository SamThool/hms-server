const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient_Appointment",
    },

    isNotificationForRefund: {
      type: Boolean,
      default: false,
    },
    refundAmount: {
      type: Number,
    },
    refundReason: {
      type: String,
    },
    refundBy: {
      type: String,
    },
    receiptId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opd_Receipt",
      default: null,
      required: false,
    },
    refundNoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OPD_refund_note",
      default: null,
      required: false,
    },
    discountNoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OPD_refund_note",
      default: null,
      required: false,
    },
    // --- Sender (Polymorphic) ---
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      enum: ["Admin", "Administrative"],
      required: true,
    },

    // --- Receiver (Polymorphic) ---
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultant",
    },

    // --- Approval Info (Polymorphic) ---
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "approvedByModel",
    },
    approvedByModel: {
      type: String,
      enum: ["Consultant", "Admin", "Administrative"],
      required: false,
    },

    // --- OPD & Message ---
    opdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OPD_patient",
    },
    message: {
      type: String,
    },

    // --- Financials ---
    pendingAmount: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    discountedAmount: {
      type: Number,
      default: 0,
    },
    // --- Status ---
    isRead: {
      type: Boolean,
      default: false,
    },

    isNotificationForDiscount: {
      type: Boolean,
      default: false,
    },
    services: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
