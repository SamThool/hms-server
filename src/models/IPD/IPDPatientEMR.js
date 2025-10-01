// models/IPD/IPDPatientEMR.js
const mongoose = require("mongoose");

// Paragraph entry
const ParagraphEntrySchema = new mongoose.Schema(
  {
    text: String, // paragraph content
    consultantName: String,
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant" },
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
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// Table entry (LTR = Left-to-Right, TTB = Top-to-Bottom)
const TableEntrySchema = new mongoose.Schema(
  {
    type: String, // "LTR" or "TTB"
    columns: [{ name: String }], // column headers
    rows: [[String]], // 2D array of entered data
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// EMR entry (optional)
const EMRSchema = new mongoose.Schema(
  {
    consultantName: String,
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: "Consultant" },
    updatedAt: { type: Date, default: Date.now },
    data: { type: Array, default: [] }, // existing unstructured data
    image: String,
  },
  { _id: true }
);

// Patient EMR schema
const IPDPatientEMRSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },

    // Optional structured data separate from EMR/Yammer
    paragraphs: { type: [ParagraphEntrySchema], default: [] },
    emojis: { type: [EmojiEntrySchema], default: [] },
    tables: { type: [TableEntrySchema], default: [] },

    EMR: { type: [EMRSchema], default: [] }, // existing Yammer/EMR data
  },
  { timestamps: true }
);

module.exports = mongoose.model("IPDPatientEMR", IPDPatientEMRSchema);
