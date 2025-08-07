const mongoose = require("mongoose");

// Recursive schema setup
let objectiveSchema = new mongoose.Schema({
  answerType: {
    type: String,
    required: true,
  },
  problem: {
    type: String,
   
  },
  note: {
    type: String
  },
  objective: [this], 
}, { _id: true, _id: true, timestamps: false });

// Fix recursion manually after declaration
objectiveSchema.add({ objective: [objectiveSchema] });

// Main lifestyle schema
const ObstetricHistorySchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
    },
    consultantId: {
      type: mongoose.Types.ObjectId,
      ref: 'Consultant'
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
    notes: {
      type: String,
      default:"",
    },
    objective: [objectiveSchema], 
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

// Patient lifestyle schema
const ObstetricHistorySchemaForPatient = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
    },
    configId: {
      type: mongoose.Types.ObjectId,
      ref: "Consultant",
    },
    consultantId: {
      type: mongoose.Types.ObjectId,
      ref: "Obstetric_History",
    },
    PatientId: {
      type: mongoose.Types.ObjectId,
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
    objective: [objectiveSchema], 
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

const ObstetricHistoryModel = mongoose.model("Obstetric_History", ObstetricHistorySchema);
const ObstetricHistoryModelForPatient = mongoose.model("ObstetricHistoryForPatient", ObstetricHistorySchemaForPatient);

module.exports = {
  ObstetricHistoryModel,
  ObstetricHistoryModelForPatient
};
