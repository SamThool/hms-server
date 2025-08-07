const mongoose = require("mongoose");

const CarePlanSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
    },
    consultantId: {
      type: mongoose.Types.ObjectId,
      ref: "Consultant",
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: "DepartmentSetup",
    },
    answerType: {
      type: String,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    subHeading: {
      type: Array,
      default: [],
    },
    delete: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const CarePlanModel = mongoose.model("Care_Plan", CarePlanSchema);

module.exports = CarePlanModel;
