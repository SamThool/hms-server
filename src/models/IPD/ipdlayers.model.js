const { default: mongoose } = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    que: { type: String, required: true },
    type: {
      type: String,
      enum: ["subjective", "objective"],
      required: true,
    },
    children: [], // placeholder, will fix below
  },
  { _id: true }
);

// ✅ Assign recursion properly
QuestionSchema.add({
  children: [QuestionSchema],
});

const IPDLayersSchema = new mongoose.Schema(
  {
    docName: { type: String, required: true },
    ipdSubformId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IPDSubform",
      required: true,
    },
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

const IPD_Layers = mongoose.model("IPD_Layers", IPDLayersSchema);
module.exports = IPD_Layers;
