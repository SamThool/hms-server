// controllers/ipdPatientEMRController.js
const IPDPatientEMR = require("../../models/IPD/IPDPatientEMR");

// Add EMR entry
const addEMR = async (req, res) => {
  try {
    const { patientId, consultantName, consultantId, data } = req.body;

    let patientEMR = await IPDPatientEMR.findOne({ patientId: patientId });

    const newEMR = {
      consultantName,
      consultantId,
      data,
      updatedAt: new Date(),
    };

    if (!patientEMR) {
      // create new record for patient
      patientEMR = new IPDPatientEMR({
        patientId: patientId,
        EMR: [newEMR],
      });
    } else {
      // push into existing patient EMR array
      patientEMR.EMR.push(newEMR);
    }

    await patientEMR.save();

    res.status(200).json({ message: "EMR added successfully", patientEMR });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete EMR entry
const deleteEMR = async (req, res) => {
  try {
    const { patientId, emrId } = req.params;

    const patientEMR = await IPDPatientEMR.findOne({
      patientId: patientId,
    });
    if (!patientEMR)
      return res.status(404).json({ message: "Patient not found" });

    patientEMR.EMR = patientEMR.EMR.filter(
      (emr) => emr._id.toString() !== emrId
    );

    await patientEMR.save();

    res.status(200).json({ message: "EMR deleted successfully", patientEMR });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get EMR by Patient ID
const getEMRByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patientEMR = await IPDPatientEMR.findOne({
      patientId: patientId,
    });

    if (!patientEMR) {
      return res.status(404).json({ message: "No EMR found for this patient" });
    }

    res.status(200).json(patientEMR);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addEMR, deleteEMR, getEMRByPatientId };
