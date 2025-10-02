// models/IPD/IPDPatientEMR.js
const mongoose = require("mongoose");

// Paragraph entry
const ParagraphEntrySchema = new mongoose.Schema(
  {
    text: String, // paragraph content
    consultantName: String,
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant" },
    subFormId: { type: mongoose.Schema.Types.ObjectId, ref: "IPDSubform" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Emoji entry
const EmojiEntrySchema = new mongoose.Schema(
  {
    emoji: String,
    consultantName: String,
    label: String, // optional label like "Happy"
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant" },
    subFormId: { type: mongoose.Schema.Types.ObjectId, ref: "IPDSubform" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Table entry (LTR = Left-to-Right, TTB = Top-to-Bottom)
const TableEntrySchema = new mongoose.Schema(
  {
    type: String, // "LTR" or "TTB"
    consultantName: String,
    columns: [{ name: String }], // column headers
    rows: [[String]], // 2D array of entered data
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant" },
    subFormId: { type: mongoose.Schema.Types.ObjectId, ref: "IPDSubform" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// EMR entry (optional)
const EMRSchema = new mongoose.Schema(
  {
    consultantName: String,
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant" },
    subFormId: { type: mongoose.Schema.Types.ObjectId, ref: "IPDSubform" },
    updatedAt: { type: Date, default: Date.now },
    data: { type: Array, default: [] },
    image: String,
  },
  { _id: true }
);

// Patient EMR schema
const IPDPatientEMRSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },

    // Optional structured data separate from EMR
    paragraphs: { type: [ParagraphEntrySchema], default: [] },
    emojis: { type: [EmojiEntrySchema], default: [] },
    tables: { type: [TableEntrySchema], default: [] },

    EMR: { type: [EMRSchema], default: [] }, // existing EMR data
  },
  { timestamps: true }
);

module.exports = mongoose.model("IPDPatientEMR", IPDPatientEMRSchema);
