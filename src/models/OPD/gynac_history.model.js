const mongoose = require('mongoose');

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
  objective: [this], // Temporary placeholder for recursion
}, { _id: true, _id: true, timestamps: false });

// Fix recursion manually after declaration
objectiveSchema.add({ objective: [objectiveSchema] }); // ✅ Real recursion applied here

const gynacHistorySchema = new mongoose.Schema({
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
}, {
    versionKey: false,
    timestamps: true,
});

const gynacHistorySchemaForPatient = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
    },
    gynacleConfigId: {
      type: mongoose.Types.ObjectId,
      ref: "Consultant",
    },
    consultantId: {
      type: mongoose.Types.ObjectId,
      ref: "Gynac_History",
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


const GynacHistoryModel = mongoose.model('Gynac_History', gynacHistorySchema);
const GynacPatientModel = mongoose.model('GynacPatientModel',gynacHistorySchemaForPatient);
module.exports = {GynacHistoryModel,GynacPatientModel}
