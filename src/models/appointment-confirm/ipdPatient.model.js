const mongoose = require("mongoose");

const IpdPatientSchema = new mongoose.Schema({
  bed: { type: String, default: "" },
  bedId: { type: mongoose.Types.ObjectId, ref: "Bed_master", default: null },
  occupiedBedId: {
    type: mongoose.Types.ObjectId,
    ref: "Bed_master",
    default: null,
  },
  category: { type: String, default: "" },
  floor: { type: String, default: "" },
  room: { type: String, default: "" },
  roomId: { type: mongoose.Types.ObjectId, ref: "Room", default: null },
  type: { type: String, default: "" },
  typeId: { type: mongoose.Types.ObjectId, ref: "Type", default: null },
  formType: { type: String, required: true },
  uhid: { type: String, required: true },
  uhidId: { type: mongoose.Types.ObjectId, ref: "UHID" },
  ipd_regNo: { type: String },

  prefix: { type: String, default: "" },
  prefixId: { type: mongoose.Types.ObjectId, ref: "prefix", default: null },

  patientFirstName: { type: String, required: true },
  patientMiddleName: { type: String, required: true },
  patientLastName: { type: String, required: true },
  dob: { type: Date, default: null },
  age: { type: String, default: "" },
  mobile_no: { type: Number, default: "" },
  gender: { type: String, default: "" },
  country: { type: String, default: "" },
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  address: { type: String, default: "" },
  pincode: { type: Number, default: "" },
  birthTime: { type: String, default: "" },
  martialStatus: { type: String, default: "" },
  aadhar_no: { type: Number, default: "" },
  aadhar_card: { type: String, default: "" },
  abha_no: { type: String, default: "" },
  abha_card: { type: String, default: "" },
  patientPhoto: { type: String, default: "" },
  patientImpression: { type: String, default: "" },
  bedAllocation: { type: String, default: "" },
  mlcNonMlc: { type: String, default: "" },
  note: { type: String, default: "" },

  primaryConsultant: { type: String, default: "" },
  primaryConsultantId: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    default: null,
  },
  secondaryConsultant: { type: String, default: "" },
  secondaryConsultantId: {
    type: mongoose.Types.ObjectId,
    ref: "Admin",
    default: null,
  },

  patientPayee: { type: String, default: "" },
  payeeCategory: { type: String, default: "" },
  payeeCategoryId: { type: mongoose.Types.ObjectId, ref: "Parent_Group" },

  packagesType: { type: String, default: "" },
  packageValidity: { type: String, default: "" },
  referBy: { type: String, default: "" },
  marketingCommunity: { type: String, default: "" },

  billingStatus: {
    type: String,
    enum: ["Non_Paid", "Paid", "Partially_Paid"],
    default: "Non_Paid",
  },
  opdData: {
    type: mongoose.Schema.Types.Mixed, // can store any object
    default: {},
  },

  // ✅ Added fields
  whoBookId: { type: mongoose.Types.ObjectId, ref: "Admin" },
  whoBookName: { type: String, default: "" },
  delete: { type: Boolean, default: false },

  tpa: { type: String, default: "" },
  tpaId: {
    type: mongoose.Types.ObjectId,
    ref: "TPA_Company_Master",
    default: null,
  },

  note: { type: [String], default: "" },
  dateOfAdmission: { type: Date, default: "" },
  admissionTime: { type: String, default: "" },

  cardNo: { type: String, trim: true },
  beneficiaryId: { type: String, trim: true },
  beneficiaryName: { type: String, trim: true },
  validity: { type: Date },
  sumAssured: { type: Number },
  cardAttachment: { type: String },
  policyNo: { type: String, trim: true },
  policyType: { type: String, trim: true },
  schemeName: { type: String, trim: true },
  abhaNumber: { type: String, trim: true },
  employeeId: { type: String, trim: true },
  charityIndigent: { type: String, trim: true },
  charityWeaker: { type: String, trim: true },
  charityCamp: { type: String, trim: true },
});

module.exports = mongoose.model("IPD_patient", IpdPatientSchema);

// const mongoose = require("mongoose");

// const IpdPatientSchema = new mongoose.Schema({
//   bed: { type: String, default: "" }, // e.g., "QWE_001"
//   bedId: { type: mongoose.Types.ObjectId, ref: "Bed", default: null },
//   category: { type: String, default: "" }, // e.g., "ICU"
//   floor: { type: String, default: "" }, // e.g., "1st Floor"
//   room: { type: String, default: "" }, // e.g., "qwertyuiopqwertyuiop"
//   roomId: { type: mongoose.Types.ObjectId, ref: "Room", default: null },
//   type: { type: String, default: "" }, // e.g., "NICU"
//   typeId: { type: mongoose.Types.ObjectId, ref: "Type", default: null },
//   formType: { type: String, required: true },
//   uhid: { type: String, required: true },
//   uhidId: {
//     type: mongoose.Types.ObjectId,
//     ref: "UHID",
//   },
//   ipd_regNo: { type: String },
//   prefix: { type: String, default: "" },
//   prefixId: {
//     type: mongoose.Types.ObjectId,
//     ref: "prefix",
//     required: false,
//     default: null,
//   },
//   patientFirstName: { type: String, required: true },
//   patientMiddleName: { type: String, required: true },
//   patientLastName: { type: String, required: true },
//   dob: { type: Date, default: null },
//   age: { type: String, default: "" },
//   mobile_no: { type: Number, default: "" },
//   gender: { type: String, default: "" },
//   country: { type: String, default: "" },
//   state: { type: String, default: "" },
//   city: { type: String, default: "" },
//   address: { type: String, default: "" },
//   pincode: { type: Number, default: "" },
//   birthTime: { type: String, default: "" },
//   martialStatus: { type: String, default: "" },
//   aadhar_no: { type: Number, default: "" },
//   aadhar_card: { type: String, default: "" },
//   abha_no: { type: String, default: "" },
//   abha_card: { type: String, default: "" },
//   patientPhoto: { type: String, default: "" },
//   patientImpression: { type: String, default: "" },
//   bedAllocation: { type: String, default: "" },
//   mlcNonMlc: { type: String, default: "" },
//   note: { type: String, default: "" },

//   patientPayee: { type: String, default: "" },
//   // patientPayeeId: {
//   //   type: mongoose.Types.ObjectId,
//   //   ref: "Patient_Payee",
//   // },
//   payeeCategory: { type: String, default: "" },
//   payeeCategoryId: {
//     type: mongoose.Types.ObjectId,
//     ref: "Parent_Group",
//   },

//   // speciality: { type: String, default: "" },
//   packagesType: { type: String, default: "" },
//   packageValidity: { type: String, default: "" },
//   referBy: { type: String, default: "" },
//   marketingCommunity: { type: String, default: "" },
//   note: { type: String, default: "" },

//   // status: {
//   //   type: String,
//   //   enum: ["pending", "out"],
//   //   default: "pending",
//   // },

//   billingStatus: {
//     type: String,
//     enum: ["Non_Paid", "Paid", "Partially_Paid"],
//     default: "Non_Paid",
//   },
//   whoBookId: {
//     type: mongoose.Types.ObjectId,
//     ref: "Admin",
//   },
//   whoBookName: {
//     type: String,
//   },
//   // patientIn: {
//   //   type: Boolean,
//   //   default: false,
//   // },
//   tpa: { type: String, default: "" },
//   tpaId: {
//     type: mongoose.Types.ObjectId,
//     ref: "TPA_Company_Master",
//     default: null,
//     required: false,
//   },
//   note: { type: [String], default: "" },
//   dateOfAdmission: {
//     type: Date,
//     default: "",
//   },
//   admissionTime: {
//     type: String,
//     default: "",
//   },
//   cardNo: {
//     type: String,
//     trim: true,
//   },
//   beneficiaryId: {
//     type: String,
//     trim: true,
//   },
//   beneficiaryName: {
//     type: String,
//     trim: true,
//   },
//   validity: {
//     type: Date,
//   },
//   sumAssured: {
//     type: Number,
//   },
//   cardAttachment: {
//     type: String,
//   },
//   policyNo: {
//     type: String,
//     trim: true,
//   },
//   policyType: {
//     type: String,
//     trim: true,
//   },
//   schemeName: {
//     type: String,
//     trim: true,
//   },
//   abhaNumber: {
//     type: String,
//     trim: true,
//   },
//   employeeId: {
//     type: String,
//     trim: true,
//   },
//   charityIndigent: {
//     type: String,
//     trim: true,
//   },
//   charityWeaker: {
//     type: String,
//     trim: true,
//   },
//   charityCamp: {
//     type: String,
//     trim: true,
//   },
//   delete: {
//     type: Boolean,
//     default: false,
//   },
// });

// module.exports = mongoose.model("IPD_patient", IpdPatientSchema);
