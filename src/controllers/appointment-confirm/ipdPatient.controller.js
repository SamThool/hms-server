const IpdPatientModel = require("../../models/appointment-confirm/ipdPatient.model");
const UHID = require("../../models/UHID.model");
const PatientDetails = require("../../models/Masters/patientAppointment.model");
const AdminModel = require("../../models/admin.model");
const ConsultantModel = require("../../models/Staffs/consultants/consultants.model");
const EmployeeModel = require("../../models/Staffs/employee/employee.model");
const mongoose = require("mongoose");
const generateUHID = require("../../utils/generateUhid/generateuhid");

const getUhidAndRegNo = async (req, res) => {
  try {
    const lastUhid = await UHID.findOne().sort({ createdAt: -1 });
    const lastReg = await IpdPatientModel.findOne()
      .sort({ createdAt: -1 })
      .select("ipd_regNo");
    res.json({
      data: {
        uhid: lastUhid,
        reg: lastReg,
      },
    });
  } catch (err) {
    console.error("Error in getUhidAndRegNo:", err); // Add error logging
    res.status(500).json({ message: "Internal server error" });
  }
};

const generateNewIpdRegNo = async () => {
  try {
    const lastPatient = await IpdPatientModel.findOne()
      .sort({ createdAt: -1 })
      .select("ipd_regNo");

    let newRegNo;

    if (lastPatient && lastPatient.ipd_regNo) {
      const lastNumber = parseInt(lastPatient.ipd_regNo.replace(/\D/g, ""));
      newRegNo = `IPD${(lastNumber + 1).toString().padStart(6, "0")}`;
    } else {
      newRegNo = "IPD000001";
    }

    return newRegNo; // just return the string
  } catch (err) {
    console.error("Error generating new IPD registration number:", err);
    throw err;
  }
};

const findBedPatient = async (req, res) => {
  try {
    const { bedMasterId, bedName } = req.params;

    if (!bedMasterId || !bedName) {
      return res.status(400).json({
        success: false,
        error: "bedMasterId and bedName are required",
      });
    }

    // Find an active patient on this bed
    const patient = await IpdPatientModel.findOne({
      bedId: bedMasterId,
      bed: bedName,

      delete: false,
    }).select(
      "uhid patientFirstName patientMiddleName patientLastName ipd_regNo bed bedId"
    );

    if (!patient) {
      return res.status(200).json({ success: true, patient: null });
    }

    return res.status(200).json({ success: true, patient });
  } catch (error) {
    console.error("Error finding bed patient:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const CreateRegistrationDetail = async (req, res) => {
  try {
    const userId = req.user?.adminId;
    const user = await AdminModel.findOne({ _id: userId });
    const formType = req.body.formType;
    if (!formType) {
      return res.status(400).json({ message: "Form type is required" });
    }

    // Destructure uhidNo from body
    const { uhid, ...restOfBody } = req.body;
    if (!uhid) {
      return res.status(400).json({ message: "UHID number is required" });
    }

    // Handle file uploads
    let aadharCardFile = null;
    let abhaCardFile = null;
    let cardAttachmentFile = null;

    if (req.files?.aadhar_card?.[0]) {
      aadharCardFile = req.files.aadhar_card[0].filename;
    }
    if (req.files?.abha_card?.[0]) {
      abhaCardFile = req.files.abha_card[0].filename;
    }
    if (req.files?.cardAttachment?.[0]) {
      cardAttachmentFile = req.files.cardAttachment[0].filename;
    }

    // Determine who booked the registration
    let whoBookId, whoBookName;
    if (user?.role === "admin") {
      whoBookId = user?.refId;
      whoBookName = user?.name;
    } else if (user?.role === "doctor") {
      const doctor = await ConsultantModel.findOne({ _id: user?.refId });
      whoBookId = user?.refId;
      whoBookName = user?.name;
      restOfBody.user = doctor?.basicDetails?.user;
    } else {
      const employee = await EmployeeModel.findOne({ _id: user?.refId });
      whoBookId = user?.refId;
      whoBookName = employee?.basicDetails?.fullName || user?.name;
      restOfBody.user = employee?.basicDetails?.user;
    }

    // Default values
    const defaultValues = {
      whoBookId,
      whoBookName,
      delete: false,
    };

    // Normalize TPA
    let tpaId = restOfBody.tpaId?.length === 0 ? null : restOfBody.tpaId;

    // 🔥 Generate a new ipd_regNo
    const ipd_regNo = await generateNewIpdRegNo();

    // Create new doc
    const newRegDetail = new IpdPatientModel({
      ...defaultValues,
      ...restOfBody,
      aadhar_card: aadharCardFile,
      abha_card: abhaCardFile,
      cardAttachment: cardAttachmentFile,
      tpaId,
      uhid: uhid,
      occupiedBedId: req.body.bedId,
      ipd_regNo, // 👈 add here
    });

    await newRegDetail.save();

    return res.status(201).json({
      message: `${formType} registration created successfully`,
      patientRegistration: newRegDetail,
    });
  } catch (error) {
    console.error("Error during CreateRegistrationDetail:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getAllRegisteration = async (req, res) => {
  try {
    const RegData = await IpdPatientModel.find();
    return res.status(200).json({ data: RegData });
  } catch (error) {
    console.error("Error in getAllRegistration:", error); // Add error logging
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const updateRegistation = async (req, res) => {
  try {
    const { id } = req.params;
    const { patientId, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid registration ID" });
    }

    if (!patientId || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: "Invalid or missing patient ID" });
    }

    const pRegistration = await IpdPatientModel.findById(id);
    if (!pRegistration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    const patientDetails = await PatientDetails.findById(patientId);
    if (!patientDetails) {
      return res.status(404).json({ message: "Patient details not found" });
    }

    Object.keys(updateData).forEach((key) => {
      if (patientDetails[key] !== undefined && updateData[key] !== undefined) {
        patientDetails[key] = updateData[key];
      }
    });

    await patientDetails.save();

    const updatedRegistration = await IpdPatientModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      message: "Registration updated successfully",
      patientRegistration: updatedRegistration,
      patientDetails,
    });
  } catch (error) {
    console.error("Error updating registration:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  CreateRegistrationDetail,
  getAllRegisteration,
  updateRegistation,
  getUhidAndRegNo,
  findBedPatient,
};
