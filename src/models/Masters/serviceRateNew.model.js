const mongoose = require("mongoose");

const serviceSubSchema = new mongoose.Schema({
  // ADDED: New fields for the distinct "Service Id"
  serviceId: {
    type: String,
    default: ''
  },
  serviceIdCreatedAt: {
    type: Date,
    default: Date.now
  },
  serviceIdUpdatedAt: {
    type: Date,
    default: Date.now
  },
  // --- Existing fields below ---
  serviceIdOfRelatedMaster: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    // Note: The 'ref' will be overridden in the main schema
  },
  rate: {
    type: Number,
    default: 0,
  },
  code: {
    type: String,
    default: "",
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  rateCreatedAt: {
    type: Date,
    default: Date.now,
  },
  rateUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  codeCreatedAt: {
    type: Date,
    default: Date.now,
  },
  codeUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  codeCreatedBy: {
    type: String,
    default: "",
  },
  codeUpdatedBy: {
    type: String,
    default: "",
  },
  rateCreatedBy: {
    type: String,
    default: "",
  },
  rateUpdatedBy: {
    type: String,
    default: "",
  },
  filter: {
    type: String,
    default: "",
  },
}, { _id: false }); // Using a base schema simplifies repetition

const serviceRateListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
    },
    parentPayee: {
      type: [String],
    },
    payee: {
      type: [String],
    },
    pathology: [
      {
        ...serviceSubSchema.obj,
        serviceIdOfRelatedMaster: { ...serviceSubSchema.obj.serviceIdOfRelatedMaster, ref: 'InvestigationPathologyMaster' }
      }
    ],
    radiology: [
      {
        ...serviceSubSchema.obj,
        serviceIdOfRelatedMaster: { ...serviceSubSchema.obj.serviceIdOfRelatedMaster, ref: 'InvestigationRadiologyMaster' }
      }
    ],
    opdPackage: [
      {
        ...serviceSubSchema.obj,
        serviceIdOfRelatedMaster: { ...serviceSubSchema.obj.serviceIdOfRelatedMaster, ref: 'OPD_Packages_Master' }
      }
    ],
    otherServices: [
      {
        ...serviceSubSchema.obj,
        serviceIdOfRelatedMaster: { ...serviceSubSchema.obj.serviceIdOfRelatedMaster, ref: 'ServiceDetailsMaster' }
      }
    ],
    opdConsultant: [
      {
        ...serviceSubSchema.obj,
        serviceIdOfRelatedMaster: { ...serviceSubSchema.obj.serviceIdOfRelatedMaster, ref: 'opdConsultantService' }
      }
    ],
    otherDiagnostics: [
      {
        ...serviceSubSchema.obj,
        serviceIdOfRelatedMaster: { ...serviceSubSchema.obj.serviceIdOfRelatedMaster, ref: 'OtherDiagnosticsMaster' }
      }
    ],
    pathologyProfiles: [
      {
        ...serviceSubSchema.obj,
        serviceIdOfRelatedMaster: { ...serviceSubSchema.obj.serviceIdOfRelatedMaster, ref: 'ProfileMasterModel' }
      }
    ],
    delete: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);


const ServiceRateList = mongoose.model(
  "service-modal-list",
  serviceRateListSchema
);

// This second schema seems unrelated to the main logic, but is included as it was in the original code.
const serviceRateSchema = new mongoose.Schema(
  {
    billGroupName: {
      type: String,
      trim: true,
    },
    serviceName: {
      type: String,
    },
    department: {
      type: [String],
    },
    code: {
      type: [String],
    },
    rate: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceModel = mongoose.model("service-modal-rate", serviceRateSchema);
module.exports = { ServiceRateList, ServiceModel };