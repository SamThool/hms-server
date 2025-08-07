const OPDCertificateModel = require("../../../models/OPD/OPDCertificate/OPDCertificateModel");

exports.createCertificate = async (req, res) => {
  try {
    const { certificateName, description, certificationSentence } = req.body;

    // Simple validation
    if (!certificateName || !description) {
      return res
        .status(400)
        .json({ message: "certificateName and description are required." });
    }

    const newCertificate = new OPDCertificateModel({
      certificateName,
      description,
      certificationSentence,
    });

    const savedCertificate = await newCertificate.save();

    return res.status(201).json(savedCertificate);
  } catch (error) {
    console.error("Error creating certificate:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await OPDCertificateModel.find().sort({
      createdAt: -1,
    }); // latest first
    res.status(200).json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res
      .status(500)
      .json({ message: "Server Error while fetching certificates" });
  }
};

exports.updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCertificate = await OPDCertificateModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // return the updated document
        runValidators: true, // validate the schema
      }
    );

    if (!updatedCertificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json(updatedCertificate);
  } catch (error) {
    console.error("Error updating certificate:", error);
    res
      .status(500)
      .json({ message: "Server error while updating certificate" });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCert = await OPDCertificateModel.findByIdAndDelete(id);
    if (!deletedCert) {
      return res.status(404).json({ message: "Certificate not found" });
    }
    return res
      .status(200)
      .json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
