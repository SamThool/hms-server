const mongoose = require('mongoose')

// Schema for basic details
const basicDetailsSchema = new mongoose.Schema({
  empCode: { type: String },
  prefix: { type: mongoose.Types.ObjectId, ref: 'Prefix' },
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dateOfBirth: { type: Date },
  dateOfAnniversary: { type: Date },
  adharNumber: { type: String },
  panNumber: { type: String },
  profilePhoto: { type: String },
  passPortNumber: { type: String },

  contactNumber: { type: String },
  alternateContactNumber: { type: String },
  email: { type: String },
  alternateEmail: { type: String },

  residentialAddress: { type: String },
  residentialPincode: { type: String },
  residentialCity: { type: String },
  residentialState: { type: String },
  residentialDistrict: { type: String },
  isPermanentSame: { type: Boolean },
  permanentAddress: { type: String },
  permanentPincode: { type: String },
  permanentCity: { type: String },
  permanentDistrict: { type: String },
  permanentState: { type: String },

  emergencyContactPersonName: { type: String },
  emergencyContactPersonMobileNumber: { type: String },
  emergencyAddress: { type: String },

  minimumQualification: { type: String },
  diploma: { type: [String] },
  graduation: { type: [String] },
  postGraduation: { type: [String] },
  otherQualification: { type: String }
})

// Schema for past employment details
const pastEmploymentDetailsSchema = new mongoose.Schema({
  organisationName: { type: String, required: true },
  designation: { type: String, required: true },
  empCode: { type: String },
  joiningDate: { type: Date },
  relievingDate: { type: Date },
  inHandSalary: { type: String },
  yearsOfExperience: { type: String },
  note: { type: String }
})

// Schema for bank details
const HRFinanceSchema = new mongoose.Schema({
  nameOnBankAccount: { type: String },
  bankAccountNumber: { type: String },
  bankName: { type: String },
  branchName: { type: String },
  ifscCode: { type: String },
  panCardNo: { type: String },
  cancelCheck: { type: String }
})

// Schema for employment details
const employmentDetailsSchema = new mongoose.Schema({
  departmentOrSpeciality: {
    type: mongoose.Types.ObjectId,
    ref: 'DepartmentSetup'
  },

  empRole: {
    type: mongoose.Types.ObjectId,
    ref: 'EmployeeRole'
  },

  designation: {
    type: mongoose.Types.ObjectId,
    ref: 'Designation'
  },

  typeOfEmployee: {
    type: String
  },

  joiningDate: { type: Date },
  location: { type: String },
  appointmentDate: { type: Date },
  reportTo: { type: mongoose.Types.ObjectId, ref: 'Administrative' },
  description: { type: String }
})

//schema for system rights
const systemRightsSchema = new mongoose.Schema({
  authorizedIds: {
    type: Map,
    of: Boolean
  },
  actionPermissions: {
    type: Map,
    of: new mongoose.Schema({
      Add: { type: Boolean, default: false },
      View: { type: Boolean, default: false },
      Edit: { type: Boolean, default: false },
      Delete: { type: Boolean, default: false }
    })
  }
})


// schema for Salary and wages
const DeductionComponentSchema = new mongoose.Schema({
  employee: Number,
  employer: Number
}, { _id: false }); // Prevents _id from being added inside each deduction component


const SalaryAndWages = new mongoose.Schema({
  employeeId: String,
  name: String,
  designation: String,
  incomeDetails: {
    basicSalary: Number,
    incomeComponents: {
      type: Map,            // Dynamic income components as Map
      of: Number,
      default: {}
    },
    grossMonthlyIncome: Number
  },
  deductionDetails: {
    // deductionComponents is a Map of { employee: Number, employer: Number }
    deductionComponents: {
      type: Map,
      of:   DeductionComponentSchema,
      default: {}
    },
    totalEmployeeContributions: Number,
    totalEmployerContributions: Number
  }
});


// Main schema for administrative records
const administrativeSchema = new mongoose.Schema(
  {
    basicDetails: basicDetailsSchema,
    pastEmploymentDetails: [pastEmploymentDetailsSchema],
    employmentDetails: employmentDetailsSchema,
    documentation: { type: Map, of: String },
    hrFinance: HRFinanceSchema,
    systemRights: systemRightsSchema,
    salaryAndWages: SalaryAndWages,
    delete: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

// Model
const Administrative = mongoose.model('Administrative', administrativeSchema)

module.exports = Administrative
