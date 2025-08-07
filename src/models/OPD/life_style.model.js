// const mongoose = require("mongoose");

// // Recursive schema setup
// let objectiveSchema = new mongoose.Schema({
//   answerType: {
//     type: String,
//     required: true,
//   },
//   problem: {
//     type: String,
   
//   },
//   notes: {
//     type: String
//   },
//   objective: [this], // Temporary placeholder for recursion
// }, { _id: true, _id: true, timestamps: false });

// // Fix recursion manually after declaration
// objectiveSchema.add({ objective: [objectiveSchema] }); // ✅ Real recursion applied here

// // Main lifestyle schema
// const lifeStyleHistorySchema = new mongoose.Schema(
//   {
//     count: {
//       type: Number,
//       default: 0,
//     },
//     departmentId: {
//       type: mongoose.Types.ObjectId,
//       ref: "DepartmentSetup",
//     },
//     answerType: {
//       type: String,
//       required: true,
//     },
//     problem: {
//       type: String,
//       required: true,
//     },
//     notes: {
//       type: String,
//       default:"",
//     },
//     objective: [objectiveSchema], // ✅ recursive objectiveSchema used
//     delete: {
//       type: Boolean,
//       default: false,
//     },
//     deletedAt: {
//       type: Date,
//     },
//   },
//   {
//     versionKey: false,
//     timestamps: true,
//   }
// );

// // Patient lifestyle schema
// const lifeStyleHistorySchemaForPatient = new mongoose.Schema(
//   {
//     count: {
//       type: Number,
//       default: 0,
//     },
//     lifeStyleConfigId: {
//       type: mongoose.Types.ObjectId,
//       ref: "Consultant",
//     },
//     consultantId: {
//       type: mongoose.Types.ObjectId,
//       ref: "Life_Style",
//     },
//     PatientId: {
//       type: mongoose.Types.ObjectId,
//     },
//     departmentId: {
//       type: mongoose.Types.ObjectId,
//       ref: "DepartmentSetup",
//     },
//     answerType: {
//       type: String,
//       required: true,
//     },
//     problem: {
//       type: String,
//       required: true,
//     },
//     notes: {
//       type: String,
//       default: "", // ✅ Add this line
//     },
//     objective: [objectiveSchema], // ✅ recursive schema reused
//     delete: {
//       type: Boolean,
//       default: false,
//     },
//     deletedAt: {
//       type: Date,
//     },
//   },
//   {
//     versionKey: false,
//     timestamps: true,
//   }
// );

// const LifeStyleModel = mongoose.model("Life_Style", lifeStyleHistorySchema);
// const LifeStyleHistoryModelForPatient = mongoose.model("lifeStyleHistorySchemaForPatient", lifeStyleHistorySchemaForPatient);

// module.exports = {
//   LifeStyleModel,
//   LifeStyleHistoryModelForPatient
// };




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
  objective: [this], // Temporary placeholder for recursion
}, { _id: true, _id: true, timestamps: false });

// Fix recursion manually after declaration
objectiveSchema.add({ objective: [objectiveSchema] }); // ✅ Real recursion applied here

// Main lifestyle schema
const lifeStyleHistorySchema = new mongoose.Schema(
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
    objective: [objectiveSchema], // ✅ recursive objectiveSchema used
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
const lifeStyleHistorySchemaForPatient = new mongoose.Schema(
  {
    count: {
      type: Number,
      default: 0,
    },
    lifeStyleConfigId: {
      type: mongoose.Types.ObjectId,
      ref: "Consultant",
    },
    consultantId: {
      type: mongoose.Types.ObjectId,
      ref: "Life_Style",
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

const LifeStyleModel = mongoose.model("Life_Style", lifeStyleHistorySchema);
const LifeStyleHistoryModelForPatient = mongoose.model("lifeStyleHistorySchemaForPatient", lifeStyleHistorySchemaForPatient);

module.exports = {
  LifeStyleModel,
  LifeStyleHistoryModelForPatient
};
