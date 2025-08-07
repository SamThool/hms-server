const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
  {
    certificateName: { type: String, required: true },
    description: { type: String, required: true },
    certificationSentence: String,
  },
  { timestamps: true }
);

const OPDCertificateModel = mongoose.model(
  "OPD_Certificate",
  CertificateSchema
);

module.exports = OPDCertificateModel;
