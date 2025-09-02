const httpStatus = require("http-status");
const PatientPathologyModel = require("../../../models/OPD/Patient/patient_pathology.model");
const OpdPatientModel = require("../../../models/appointment-confirm/opdPatient.model");

// ✅ Create a new pathology entry
const createPathology = async (req, res) => {
  try {
    const { patientId } = req.body;

    // Check if patient already has a pathology record
    let pathologyRecord = await PatientPathologyModel.findOne({ patientId });

    if (pathologyRecord) {
      // If exists, push new pathology details into the existing record
      pathologyRecord = await PatientPathologyModel.findOneAndUpdate(
        { patientId },
        { $push: { pathology: { $each: req.body.pathology } } }, // assuming pathology is an array
        { new: true }
      );
    } else {
      // If not exists, create new pathology record
      pathologyRecord = new PatientPathologyModel(req.body);
      await pathologyRecord.save();
    }

    // Update OPD patient record with the pathology _id
    await OpdPatientModel.findOneAndUpdate(
      { patientId },
      {
        $set: {
          "requests.pathology": pathologyRecord._id,
        },
      },
      { new: true }
    );

    res.status(201).json({
      message: "Pathology record added successfully",
      data: pathologyRecord,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating/updating pathology record",
      error: error.message,
    });
  }
};

// ✅ Get all pathology records
const getAllPathologies = async (req, res) => {
  try {
    const pathologies = await PatientPathologyModel.find({
      deleted: false,
    });

    res
      .status(200)
      .json({ message: "Pathologies fetched successfully", data: pathologies });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pathologies", error: error.message });
  }
};

// ✅ Get a single pathology record by ID
const getPathologyById = async (req, res) => {
  try {
    const { id } = req.params;
    const pathology = await PatientPathologyModel.findOne({ patientId: id });

    if (!pathology || pathology.deleted) {
      return res.status(404).json({ message: "Pathology record not found" });
    }

    res
      .status(200)
      .json({ message: "Pathology fetched successfully", data: pathology });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pathology", error: error.message });
  }
};

// ✅ Update a pathology record
const updatePathology = async (req, res) => {
  try {
    const { id } = req.params;
    const { pathology } = req.body;

    const updatedPathology = await PatientPathologyModel.findByIdAndUpdate(
      id,
      { pathology },
      { new: true }
    );

    if (!updatedPathology) {
      return res.status(404).json({ message: "Pathology record not found" });
    }

    res.status(200).json({
      message: "Pathology updated successfully",
      data: updatedPathology,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating pathology", error: error.message });
  }
};

// ✅ Soft delete a pathology record
const deletePathology = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPathology = await PatientPathologyModel.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!deletedPathology) {
      return res.status(404).json({ message: "Pathology record not found" });
    }

    res.status(200).json({
      message: "Pathology deleted successfully",
      data: deletedPathology,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting pathology", error: error.message });
  }
};

module.exports = {
  createPathology,
  getAllPathologies,
  getPathologyById,
  updatePathology,
  deletePathology,
};
