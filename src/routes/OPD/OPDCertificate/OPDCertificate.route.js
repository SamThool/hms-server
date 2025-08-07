const express = require("express");
const router = express.Router();

const {
  createCertificate,
  getAllCertificates,
  updateCertificate,
  deleteCertificate,
} = require("../../../controllers/OPD/OPDCertificate/OPDCertificateController");

router.post("/", createCertificate); // Create certificate
router.get("/", getAllCertificates); // Get all certificates
router.put("/:id", updateCertificate); // Update certificate
router.delete("/:id", deleteCertificate); // Delete certificate

module.exports = router;
