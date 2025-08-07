const mongoose = require('mongoose');

// Define recursive objective schema
let objectiveSchema = new mongoose.Schema({
  answerType: {
    type: String,
    required: true,
  },
  problem: {
    type: String,
  },
  note: {
    type: String,
  },
  objective: [this], // temporary placeholder for recursion
}, { _id: true, timestamps: false });

// Fix recursion manually
objectiveSchema.add({ objective: [objectiveSchema] });


const PediatricHistorySchema = new mongoose.Schema({
    count:{
        type:Number,
        default:0,
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Consultant'
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    answerType: {
        type: String,
        required: true,
    },
    problem:{
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
}, {
    versionKey: false,
    timestamps: true,
});

const pediatricHistorySchemaForPatient = new mongoose.Schema(
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
      ref: "Pediatric_History",
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
    objective: [objectiveSchema], // ✅ recursive schema reused
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


const PediatricHistoryModel = mongoose.model('Pediatric_History', PediatricHistorySchema);
const PediatricHistoryModelForPatient = mongoose.model('Pediatric_History_For_Patient', pediatricHistorySchemaForPatient);

module.exports = {PediatricHistoryModel,PediatricHistoryModelForPatient};
