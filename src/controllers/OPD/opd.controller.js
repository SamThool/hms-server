const { OPDModel, InvoiceNoModel } = require("../../models");
const {
  ConsultantModel,
  EmployeeModel,
  ServiceDetailsModel,
  OPDPackageModel,
} = require("../../models");
const { patientDetailsModel } = require("../../models");
const { MedicalProblemModel, DrugHistoryModel } = require("../../models");
const { DrugAllergyModel, FoodAllergyModel } = require("../../models");
const { GeneralAllergyModel } = require("../../models");
const {
  PediatricHistoryModel,
} = require("../../models/OPD/pediatric_history.model");
const {
  PediatricHistoryModelForPatient,
} = require("../../models/OPD/pediatric_history.model");
const {
  ObstetricHistoryModelForPatient,
  ObstetricHistoryModel,
} = require("../../models/OPD/obstetric_history.model");

const OpdPatientModel = require("../../models/appointment-confirm/opdPatient.model");
const FamilyHistoryProblem = require("../../models/OPD/familyHistory.model");
const {
  NutritionalHistoryModel,
  NutritionalHistoryModelForPatient,
} = require("../../models/OPD/nutritional_history.model");
const { FamilyMemberModel } = require("../../models");
const {
  LifeStyleModel,
  LifeStyleHistoryModelForPatient,
} = require("../../models/OPD/life_style.model");
const { ProcedureModel, PatientProcedureModel } = require("../../models");
const { InstructionModel, PatientInstructionModel } = require("../../models");
const { AdviceModel } = require("../../models");
const {
  ChiefComplaintModel,
  PresentIllnessHistoryModel,
  PatientChiefComplaintModel,
} = require("../../models");
const PainChiefComplaintModel = require("../../models/OPD/painChiefComplaint.model");
const {
  ProvisionalDiagnosisModel,
  FinalDiagnosisModel,
  PatientProvisionalDiagnosisModel,
} = require("../../models");
const { OPDMenuModel } = require("../../models");
const { RiskFactorModel } = require("../../models");
const {
  GeneralExaminationModel,
  LocalExaminationModel,
  PatientExaminationModel,
} = require("../../models");
const {
  PatientHistroyModel,
  PatientPresentIllnessHistoryModel,
  PatientMedicalPrescriptionModel,
  PatientFinalDiagnosisModel,
  PatientFollowUpModel,
  PatientGlassPrescriptionModel,
} = require("../../models");
const { SystematicExaminationModel } = require("../../models");
const { OtherExaminationModel } = require("../../models");
const { SurgeryPackageModel } = require("../../models");
const { OPDBillingModel } = require("../../models");
const {
  AdminModel,
  InvestigationPathologyMasterModel,
  InvestigationRadiologyMasterModel,
  PatientVitalsModel,
  PatientLabRadiologyModel,
} = require("../../models");
const { GynacPatientModel } = require("../../models/OPD/gynac_history.model");
const { GynacHistoryModel } = require("../../models/OPD/gynac_history.model");
const EmergencyPatientMedicalPrescriptionModel = require("../../models/Emergency/Patient/emergency_patient_medical_prescription.model");
const {
  OtherHistoryModelForPatient,
  OtherHistoryModel,
} = require("../../models/OPD/other_history.model");

const opdRegSchemaValidation = require("../../validations/OPD/opd.validation");

const httpStatus = require("http-status");
const mongoose = require("mongoose");
const opdPatientModel = require("../../models/appointment-confirm/opdPatient.model");

let serialCounter = 1;

const generateToken = () => {
  const serialNumber = serialCounter.toString(36).padStart(4, "0");
  serialCounter++;
  return serialNumber;
};

let opdCounter = 1;
const generateOpdNumber = () => {
  const year = new Date().getFullYear();
  const serialNumber = opdCounter.toString().padStart(5, "0");
  opdCounter++;
  return `OP-${year}-${serialNumber}`;
};

const createOpdRegistion = async (req, res) => {
  try {
    const userId = req.user.adminId;
    const user = await AdminModel.findOne({ _id: userId });

    if (user.role == "admin") {
      const { error } = opdRegSchemaValidation.validate(req.body);
      if (error) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ error: error.details[0].message });
      }
      req.body.user = user.refId;

      const tokenNumber = generateToken();
      const opdNumber = generateOpdNumber();
      const newOpd = new OPDModel({
        ...req.body,
        tokenNumber: tokenNumber,
        opdNumber: opdNumber,
        whoBookId: user.refId,
        whoBookName: user.name,
      });
      const savedOpdReg = await newOpd.save();
      res
        .status(httpStatus.CREATED)
        .json({ msg: "OPD Registration Done ", data: savedOpdReg });
    } else if (user.role == "doctor") {
      const doctor = await ConsultantModel.findOne({ _id: user.refId });
      const { error } = opdRegSchemaValidation.validate(req.body);
      if (error) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ error: error.details[0].message });
      }
      req.body.user = doctor.basicDetails.user;
      console.log(req.body.user);
      const tokenNumber = generateToken();
      const opdNumber = generateOpdNumber();
      const newOpd = new OPDModel({
        ...req.body,
        tokenNumber: tokenNumber,
        opdNumber: opdNumber,
        whoBookId: user.refId,
        whoBookName: user.name,
      });
      const savedOpdReg = await newOpd.save();
      res
        .status(httpStatus.CREATED)
        .json({ msg: "OPD Registration Done ", data: savedOpdReg });
    } else if (user.role !== "admin" && user.role !== "doctor") {
      const employee = await EmployeeModel.findOne({ _id: user.refId });
      const { error } = opdRegSchemaValidation.validate(req.body);
      if (error) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ error: error.details[0].message });
      }
      req.body.user = employee.basicDetails.user;
      console.log(req.body.user);
      const tokenNumber = generateToken();
      const opdNumber = generateOpdNumber();
      const newOpd = new OPDModel({
        ...req.body,
        tokenNumber: tokenNumber,
        opdNumber: opdNumber,
        whoBookId: user.refId,
        whoBookName: user.name,
      });
      const savedOpdReg = await newOpd.save();
      res
        .status(httpStatus.CREATED)
        .json({ msg: "OPD Registration Done ", data: savedOpdReg });
    }
  } catch (error) {
    console.error("Error storing opd registration:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteHistoryFromMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const historyType = req.body?.ids?.history;

    if (!id || !historyType) {
      return res
        .status(400)
        .json({ message: "Patient ID or history type is missing" });
    }

    const patient = await PatientHistroyModel.findOne({
      opdPatientId: new mongoose.Types.ObjectId(id),
    });
    if (!patient) {
      return res.status(404).json({ message: "Patient history not found" });
    }

    switch (historyType) {
      case "pastHistory":
        patient.medicalProblems = [];
        break;

      case "drugHistory":
        patient.drugHistory = [];
        break;

      case "allergies":
        patient.allergies = {
          having: "",
          which: {
            food: [],
            general: [],
            drug: [],
            other: "",
          },
        };
        break;

      case "familyHistory":
        patient.familyHistory = [];
        break;

      case "procedureHistory":
        patient.procedure = {
          having: "",
          which: [],
        };
        break;

      default:
        return res.status(400).json({ message: "Invalid history type" });
    }

    await patient.save();
    res
      .status(200)
      .json({ message: `${historyType} deleted successfully`, data: patient });
  } catch (error) {
    console.error("Error deleting history:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const updateOpdRegistion = async (req, res) => {
  try {
    const opdId = req.params.id;
    const opd = await OPDModel.findOne({ _id: opdId });
    if (!opd) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "OPD registration not found" });
    }
    const updatedOPD = await OPDModel.findOneAndUpdate(
      { _id: opdId },
      { $set: req.body },
      { new: true }
    );
    res
      .status(httpStatus.OK)
      .json({ msg: "OPD registration updated", data: updatedOPD });
  } catch (error) {
    console.error("Error updating opd registration:", error);
    res.status(400).json({ error: error.message });
  }
};

const changeConfirmAppointmentStatus = async (req, res) => {
  try {
    const opdConfirmAppointment = await OPDModel.findOneAndUpdate(
      { _id: req.params.id },
      { confirmAppointment: true }
    );
    res
      .status(httpStatus.OK)
      .json({ msg: "Appointment Confirmed", data: opdConfirmAppointment });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const changeCancelAppointmentStatus = async (req, res) => {
  try {
    const opdCancelmAppointment = await OPDModel.findOneAndUpdate(
      { _id: req.params.id },
      { cancelAppointment: true }
    );
    res
      .status(httpStatus.OK)
      .json({ msg: "Appointment Cancelled", data: opdCancelmAppointment });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getAllOpdRegistration = async (req, res) => {
  try {
    const userId = req.user.adminId;
    const user = await AdminModel.findOne({ _id: userId });
    if (user.role == "admin") {
      const opds = await OPDModel.find({
        delete: false,
        user: req.user.branchId,
      });
      res.status(httpStatus.OK).json({ data: opds });
    } else if (user.role == "doctor") {
      const existingdoctor = await ConsultantModel.findOne({
        _id: req.user.branchId,
      });
      const opds = await OPDModel.find({
        delete: false,
        user: existingdoctor.basicDetails.user,
      });
      res.status(httpStatus.OK).json({ data: opds });
    } else if (user.role !== "admin" && user.role !== "doctor") {
      const existingEmployee = await EmployeeModel.findOne({
        _id: req.user.branchId,
      });
      const opds = await OPDModel.find({
        delete: false,
        user: existingEmployee?.basicDetails.user,
      });
      res.status(httpStatus.OK).json({ data: opds });
    }
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getCountByConsultant = async (req, res) => {
  try {
    const userId = req.user.adminId;
    const user = await AdminModel.findOne({ _id: userId });

    if (user.role == "admin") {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const opds = await OPDModel.find({
        delete: false,
        user: req.user.branchId,
        createdAt: { $gte: currentDate },
      });

      const uniqueConsultantNames = [
        ...new Set(opds.map((opd) => opd.consultant)),
      ];

      const countPromises = uniqueConsultantNames.map(
        async (consultantName) => {
          const pendingCount = await OPDModel.countDocuments({
            delete: false,
            consultant: consultantName,
            status: "pending",
            createdAt: { $gte: currentDate },
          });

          const outCount = await OPDModel.countDocuments({
            delete: false,
            consultant: consultantName,
            status: "out",
            createdAt: { $gte: currentDate },
          });

          return {
            consultant: consultantName,
            pending: pendingCount,
            out: outCount,
          };
        }
      );

      const counts = await Promise.all(countPromises);
      res.status(httpStatus.OK).json(counts);
    } else if (user.role == "doctor") {
      const existingDoctor = await ConsultantModel.findOne({
        _id: req.user.branchId,
      });
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const opds = await OPDModel.find({
        delete: false,
        user: existingDoctor.basicDetails.user,
        createdAt: { $gte: currentDate },
      });

      const uniqueConsultantNames = [
        ...new Set(opds.map((opd) => opd.consultant)),
      ];

      const countPromises = uniqueConsultantNames.map(
        async (consultantName) => {
          const pendingCount = await OPDModel.countDocuments({
            delete: false,
            consultant: consultantName,
            status: "pending",
            createdAt: { $gte: currentDate },
          });

          const outCount = await OPDModel.countDocuments({
            delete: false,
            consultant: consultantName,
            status: "out",
            createdAt: { $gte: currentDate },
          });

          return {
            consultant: consultantName,
            pending: pendingCount,
            out: outCount,
          };
        }
      );

      const counts = await Promise.all(countPromises);
      res.status(httpStatus.OK).json(counts);
    } else if (user.role !== "admin" && user.role !== "doctor") {
      const existingEmployee = await EmployeeModel.findOne({
        _id: req.user.branchId,
      });
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const opds = await OPDModel.find({
        delete: false,
        user: existingEmployee.basicDetails.user,
        createdAt: { $gte: currentDate },
      });

      const uniqueConsultantNames = [
        ...new Set(opds.map((opd) => opd.consultant)),
      ];

      const countPromises = uniqueConsultantNames.map(
        async (consultantName) => {
          const pendingCount = await OPDModel.countDocuments({
            delete: false,
            consultant: consultantName,
            status: "pending",
            createdAt: { $gte: currentDate },
          });

          const outCount = await OPDModel.countDocuments({
            delete: false,
            consultant: consultantName,
            status: "out",
            createdAt: { $gte: currentDate },
          });

          return {
            consultant: consultantName,
            pending: pendingCount,
            out: outCount,
          };
        }
      );

      const counts = await Promise.all(countPromises);
      res.status(httpStatus.OK).json(counts);
    }
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getOPDRegistrationResponse = async (req, res) => {
  try {
    const { from, to } = req.body;

    const fromDate = new Date(from);
    const toDate = new Date(to);

    toDate.setDate(toDate.getDate() + 1);

    const opdRegistrations = await OPDModel.find({
      delete: false,
      createdAt: { $gte: fromDate, $lt: toDate },
    });

    const patientIds = opdRegistrations.map((opd) => opd.patientId.toString());

    const patientDetailsPromises = patientIds.map((patientId) =>
      patientDetailsModel.findOne({ _id: patientId })
    );

    const patientDetails = await Promise.all(patientDetailsPromises);

    const opdsWithPatientDetails = opdRegistrations.map((opd, index) => ({
      ...opd.toObject(),
      patientDetails: patientDetails[index],
    }));

    res.status(httpStatus.OK).json({ data: opdsWithPatientDetails });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getOPDRegistrationBYBilling = async (req, res) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const opds = await OPDModel.find({
      delete: false,
      patientIn: false,
      status: "pending",
      confirmAppointment: true,
      createdAt: { $gte: currentDate },
    });

    const patientIds = opds.map((opd) => opd.patientId.toString());

    const patientDetailsPromises = patientIds.map((patientId) =>
      patientDetailsModel.findOne({ _id: patientId })
    );

    const patientDetails = await Promise.all(patientDetailsPromises);

    const opdsWithPatientDetails = opds.map((opd, index) => ({
      ...opd.toObject(),
      patientDetails: patientDetails[index],
    }));

    res.status(httpStatus.OK).json({ data: opdsWithPatientDetails });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const changePatientInStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOPD = await OPDModel.findByIdAndUpdate(
      { _id: id },
      { patientIn: true, status: "out" },
      { new: true }
    );

    if (!updatedOPD) {
      throw new Error("OPD entry not found");
    }

    res.status(httpStatus.OK).json({ data: updatedOPD });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const createMedicalProblem = async (req, res) => {
  try {
    const newMedicalProblem = new MedicalProblemModel({ ...req.body });
    const savedMedicalProblem = await newMedicalProblem.save();
    res.status(httpStatus.CREATED).json({
      msg: "Medical Problem Added Successfully ",
      data: savedMedicalProblem,
    });
  } catch (error) {
    console.error("Error storing Medical Problem:", error);
    res.status(400).json({ error: error.message });
  }
};
const createFamilyHistoryProblem = async (req, res) => {
  try {
    const newFamilyProblem = new FamilyHistoryProblem({ ...req.body });
    const savedMedicalProblem = await newFamilyProblem.save();
    res.status(httpStatus.CREATED).json({
      msg: "Family Problem Added Successfully ",
      data: savedMedicalProblem,
    });
  } catch (error) {
    console.error("Error storing Medical Problem:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllFamilyHistoryProblems = async (req, res) => {
  try {
    const familyProblems = await FamilyHistoryProblem.find({ delete: false });
    res.status(httpStatus.OK).json({ data: familyProblems });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateFamilyHistoryProblem = async (req, res) => {
  try {
    const familyProblem = await FamilyHistoryProblem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!familyProblem) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Family Problem Not Found" });
    }

    return res
      .status(httpStatus.OK)
      .json({ msg: "Family Problem Updated Successfully", familyProblem });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error updating Family Problem", error });
  }
};

const getMostUsedFamilyProblems = async (req, res) => {
  try {
    const adminId =
      req.query.adminId || req.body?.adminId || req.params.adminId;
    const { id } = req.params;
    let query = { delete: false };
    if (adminId) {
      query.adminId = adminId;
    } else {
      query.departmentId = id;
    }
    const familyProblem = await FamilyHistoryProblem.find(query)
      .sort({ medicalCount: -1, createdAt: -1 })
      .limit(30);
    res.status(httpStatus.OK).json({ data: familyProblem });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteFamilyHistoryProblems = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await FamilyHistoryProblem.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Family Problem found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Family Problem deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error deleting Family Problem",
      details: err.message,
    });
  }
};

const getAllMedicalProblem = async (req, res) => {
  try {
    const medicalproblem = await MedicalProblemModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: medicalproblem });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getPatientsHistoryByUHID = async (req, res) => {
  try {
    const { uhid } = req.params;

    if (!uhid) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: "UHID is required" });
    }

    // Find patients where data.uhid matches the given uhid
    const patients = await opdPatientModel.find({ uhid });

    if (!patients.length) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "No patients found with this UHID" });
    }

    res.status(httpStatus.OK).json({ data: patients });
  } catch (error) {
    console.error("Error fetching patients by UHID:", error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateMedicalProblem = async (req, res) => {
  try {
    const medicalproblem = await MedicalProblemModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res
      .status(httpStatus.OK)
      .json({ msg: "Medical Problem  Updated Successfully", medicalproblem });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Medical Problem Not Found", error });
  }
};

const deleteMedicalProblemById = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await MedicalProblemModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Medical Problem found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Medical Problem deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting Medical Problem",
      details: err.message,
    });
  }
};

const GetMostUsedMedicalProblem = async (req, res) => {
  try {
    const adminId =
      req.query.adminId || req.body?.adminId || req.params.adminId;
    const { id } = req.params;
    let query = { delete: false };
    if (adminId) {
      query.adminId = adminId;
    } else {
      query.departmentId = id;
    }
    const medicalproblems = await MedicalProblemModel.find(query)
      .sort({ createdAt: -1 })
      .limit(30);
    res.status(httpStatus.OK).json({ data: medicalproblems });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const createDrugHistory = async (req, res) => {
  try {
    const newDrugHistory = new DrugHistoryModel({ ...req.body });
    const savedDrugHistory = await newDrugHistory.save();
    res.status(httpStatus.CREATED).json({
      msg: "Drug History Added Successfully ",
      data: savedDrugHistory,
    });
  } catch (error) {
    console.error("Error storing Drug History:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllDrugHistory = async (req, res) => {
  try {
    const DrugHistory = await DrugHistoryModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: DrugHistory });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateDrugHistory = async (req, res) => {
  try {
    const DrugHistory = await DrugHistoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res
      .status(httpStatus.OK)
      .json({ msg: "Drug History  Updated Successfully", DrugHistory });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Drug History Not Found", error });
  }
};

const deleteDrugHistoryById = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await DrugHistoryModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Drug History found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Drug History deleted successfully", result });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in deleting Drug History", details: err.message });
  }
};

const GetMostUsedDrugHistory = async (req, res) => {
  try {
    const adminId =
      req.query.adminId || req.body?.adminId || req.params.adminId;
    const { id } = req.params;
    let query = { delete: false };
    if (adminId) {
      query.adminId = adminId;
    } else {
      query.departmentId = id;
    }
    const DrugHistorys = await DrugHistoryModel.find(query)
      .sort({ createdAt: -1 })
      .limit(30);
    res.status(httpStatus.OK).json({ data: DrugHistorys });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const createDrugAllergy = async (req, res) => {
  try {
    const newDrugAllergy = new DrugAllergyModel({ ...req.body });
    const savedDrugAllergy = await newDrugAllergy.save();
    res.status(httpStatus.CREATED).json({
      msg: "Drug Allergy Added Successfully ",
      data: savedDrugAllergy,
    });
  } catch (error) {
    console.error("Error storing Drug Allergy:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllDrugAllergy = async (req, res) => {
  try {
    const drugAllergy = await DrugAllergyModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: drugAllergy });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateDrugAllergyById = async (req, res) => {
  try {
    const DrugAllergy = await DrugAllergyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res
      .status(httpStatus.OK)
      .json({ msg: "Drug Allergy  Updated Successfully", DrugAllergy });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Drug Allergy Not Found", error });
  }
};

const deleteDrugAllergyByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await DrugAllergyModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Drug Allergy found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Drug Allergy deleted successfully", result });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in deleting Drug Allergy", details: err.message });
  }
};

const GetMostUsedDrugAllergy = async (req, res) => {
  try {
    const adminId =
      req.query.adminId || req.body?.adminId || req.params.adminId;
    const { id } = req.params;
    let query = { delete: false };
    if (adminId) {
      query.adminId = adminId;
    } else {
      query.departmentId = id;
    }
    const DrugAllergy = await DrugAllergyModel.find(query)
      .sort({ createdAt: -1 })
      .limit(15);
    res.status(httpStatus.OK).json({ data: DrugAllergy });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const createFoodAllergy = async (req, res) => {
  try {
    const newFoodAllergy = new FoodAllergyModel({ ...req.body });
    const savedFoodAllergy = await newFoodAllergy.save();
    res.status(httpStatus.CREATED).json({
      msg: "Food Allergy Added Successfully ",
      data: savedFoodAllergy,
    });
  } catch (error) {
    console.error("Error storing Food Allergy:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllFoodAllergy = async (req, res) => {
  try {
    const FoodAllergy = await FoodAllergyModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: FoodAllergy });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateFoodAllergyById = async (req, res) => {
  try {
    const foodlAllergy = await FoodAllergyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res
      .status(httpStatus.OK)
      .json({ msg: "Food Allergy  Updated Successfully", foodlAllergy });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Food Allergy Not Found", error });
  }
};

const deleteFoodAllergyByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await FoodAllergyModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Food Allergy found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Food Allergy deleted successfully", result });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in deleting Food Allergy", details: err.message });
  }
};

const GetMostUsedFoodAllergy = async (req, res) => {
  try {
    const adminId =
      req.query.adminId || req.body?.adminId || req.params.adminId;
    const { id } = req.params;
    let query = { delete: false };
    if (adminId) {
      query.adminId = adminId;
    } else {
      query.departmentId = id;
    }
    const FoodAllergy = await FoodAllergyModel.find(query)
      .sort({ createdAt: -1 })
      .limit(15);
    res.status(httpStatus.OK).json({ data: FoodAllergy });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const createGeneralAllergy = async (req, res) => {
  try {
    const newGeneralAllergy = new GeneralAllergyModel({ ...req.body });
    const savedGeneralAllergy = await newGeneralAllergy.save();
    res.status(httpStatus.CREATED).json({
      msg: "General Allergy Added Successfully ",
      data: savedGeneralAllergy,
    });
  } catch (error) {
    console.error("Error storing General Allergy:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllGeneralAllergy = async (req, res) => {
  try {
    const generalAllergy = await GeneralAllergyModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: generalAllergy });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateGeneralAllergyById = async (req, res) => {
  try {
    const generalAllergy = await GeneralAllergyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res
      .status(httpStatus.OK)
      .json({ msg: "General Allergy  Updated Successfully", generalAllergy });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "General Allergy Not Found", error });
  }
};

const deleteGeneralAllergyByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await GeneralAllergyModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No General Allergy found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "General Allergy deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting General Allergy",
      details: err.message,
    });
  }
};

const GetMostUsedGeneralAllergy = async (req, res) => {
  try {
    const adminId =
      req.query.adminId || req.body?.adminId || req.params.adminId;
    const { id } = req.params;
    let query = { delete: false };
    if (adminId) {
      query.adminId = adminId;
    } else {
      query.departmentId = id;
    }
    const generalAllergy = await GeneralAllergyModel.find(query)
      .sort({ createdAt: -1 })
      .limit(15);
    res.status(httpStatus.OK).json({ data: generalAllergy });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const createFamilyMember = async (req, res) => {
  try {
    const newFamilyMember = new FamilyMemberModel({ ...req.body });
    const savedFamilyMember = await newFamilyMember.save();
    res.status(httpStatus.CREATED).json({
      msg: "Family Member Added Successfully ",
      data: savedFamilyMember,
    });
  } catch (error) {
    console.error("Error storing Family Member:", error);
    res.status(400).json({ error: error.message });
  }
};

const deleteFamilyMember = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFamilyMember = await FamilyMemberModel.findByIdAndDelete(id);

    if (!deletedFamilyMember) {
      return res.status(404).json({ msg: "Family Member not found" });
    }

    res.status(200).json({ msg: "Family Member Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting Family Member:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllFamilyMember = async (req, res) => {
  try {
    const familyMember = await FamilyMemberModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: familyMember });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const GetMostUsedFamilyMember = async (req, res) => {
  try {
    const { id } = req.params;
    const familyMember = await MedicalProblemModel.find({
      delete: false,
      departmentId: id,
    })
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(httpStatus.OK).json({ data: familyMember });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteLifeStyleObjectiveEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params;

    const lifestyle = await LifeStyleModel.findById(id);

    console.log("deleteLifeStyleObjectiveEntriesByIndex", req.body);

    if (!lifestyle) {
      return res.status(404).json({ msg: "Lifestyle not found" });
    }

    const idsToDelete = req.body?.ids || [];
    console.log(idsToDelete);

    if (!Array.isArray(idsToDelete) || idsToDelete.length === 0) {
      return res
        .status(400)
        .json({ msg: "IDs array is required and must not be empty" });
    }

    idsToDelete.forEach((idToDelete) => {
      const index = lifestyle.objective.findIndex(
        (obj) => obj._id.toString() === idToDelete
      );
      if (index !== -1) {
        lifestyle.objective.splice(index, 1);
      }
    });

    lifestyle.markModified("objective");

    await lifestyle.save();

    res.status(200).json({
      msg: "Objective entries deleted successfully",
      updatedData: lifestyle,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting objective entries",
      details: err.message,
    });
  }
};

const deleteLifeStyleInnerObjectiveDataEntries = async (req, res) => {
  try {
    const { id } = req.params;
    const { objectiveId, innerObjectiveId, innerObjectiveDataId } =
      req.body.ids;

    console.log("deleteLifeStyleInnerObjectiveDataEntries", req.body);

    if (
      !objectiveId ||
      !innerObjectiveId ||
      !Array.isArray(innerObjectiveDataId) ||
      innerObjectiveDataId.length === 0
    ) {
      return res.status(400).json({
        msg: "Invalid request data: objectiveId, innerObjectiveId, and non-empty innerObjectiveDataId array are required",
        success: false,
      });
    }

    const lifestyle = await LifeStyleModel.findById(id);
    if (!lifestyle) {
      return res
        .status(404)
        .json({ msg: "Lifestyle not found", success: false });
    }

    const objectiveItem = lifestyle.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!objectiveItem) {
      return res.status(400).json({
        msg: "Objective not found for the given objectiveId",
        success: false,
      });
    }

    const innerObjectiveItem = objectiveItem.objective.find(
      (obj) => obj._id.toString() === innerObjectiveId
    );
    if (!innerObjectiveItem) {
      return res.status(400).json({
        msg: "Inner objective not found for the given innerObjectiveId",
        success: false,
      });
    }

    if (
      !innerObjectiveItem.objective ||
      !Array.isArray(innerObjectiveItem.objective)
    ) {
      return res.status(400).json({
        msg: "Nested objective array not found in the inner objective",
        success: false,
      });
    }

    innerObjectiveDataId.forEach((idToDelete) => {
      const index = innerObjectiveItem.objective.findIndex(
        (data) => data._id.toString() === idToDelete
      );
      if (index !== -1) {
        innerObjectiveItem.objective.splice(index, 1);
      }
    });

    lifestyle.markModified("objective");
    await lifestyle.save();

    res.status(200).json({
      msg: "Inner objective data entries deleted successfully",
      updatedData: lifestyle,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting inner objective data entries",
      details: err.message,
      success: false,
    });
  }
};

const deleteLifeStyleObjectiveInnerDataEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params;
    const { objectiveId, innerDataId } = req.body?.ids;
    console.log(req.body?.ids);
    if (
      !objectiveId ||
      !Array.isArray(innerDataId) ||
      innerDataId.length === 0
    ) {
      return res.status(400).json({
        msg: "Invalid request data: objectiveId and non-empty innerDataId array are required",
        success: false,
      });
    }

    const lifestyle = await LifeStyleModel.findById(id);
    if (!lifestyle) {
      return res.status(404).json({ msg: "Lifestyle not found" });
    }

    const objectiveItem = lifestyle.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!objectiveItem) {
      return res.status(400).json({
        msg: "Objective not found for the given objectiveId",
        success: false,
      });
    }

    if (!objectiveItem.objective || !Array.isArray(objectiveItem.objective)) {
      return res.status(400).json({
        msg: "innerData array not found in the objective",
        success: false,
      });
    }

    innerDataId.forEach((idToDelete) => {
      const index = objectiveItem.objective.findIndex(
        (data) => data._id.toString() === idToDelete
      );
      if (index !== -1) {
        objectiveItem.objective.splice(index, 1);
      }
    });

    lifestyle.markModified("objective");
    await lifestyle.save();

    res.status(200).json({
      msg: "InnerData entries deleted successfully",
      updatedData: lifestyle,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting objective entries",
      details: err.message,
    });
  }
};

const editLifeStyleObjectiveInnerDataEntry = async (req, res) => {
  try {
    console.log("editLifeStyleObjectiveInnerDataEntry", req.body);
    const { id } = req.params;
    const { objectiveIndex, innerDataIndex, data } = req.body;

    if (
      typeof objectiveIndex !== "number" ||
      typeof innerDataIndex !== "number" ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid request data", success: false });
    }

    const lifestyle = await LifeStyleModel.findById(id);
    if (!lifestyle) {
      return res.status(404).json({ msg: "Lifestyle not found" });
    }

    if (objectiveIndex < 0 || objectiveIndex >= lifestyle.objective.length) {
      return res.status(400).json({ msg: "Invalid objective index" });
    }

    const objectiveItem = lifestyle.objective[objectiveIndex];

    if (
      !objectiveItem.innerData ||
      innerDataIndex < 0 ||
      innerDataIndex >= objectiveItem.innerData.length
    ) {
      return res.status(400).json({ msg: "Invalid innerData index" });
    }

    objectiveItem.innerData[innerDataIndex].data = data;

    lifestyle.markModified("objective");

    await lifestyle.save();

    res.status(200).json({
      msg: "InnerData entry updated successfully",
      updatedData: lifestyle,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating innerData entry",
      details: err.message,
    });
  }
};

const updateLifeStyleObjectiveEntryByIndex = async (req, res) => {
  try {
    const { id } = req.params;
    const { problem, layer2id, layer3id, layer4id } = req.body;
    console.log("api called");
    console.log(id, layer2id, layer3id, layer4id);

    const lifestyle = await LifeStyleModel.findById(id);

    if (!lifestyle) {
      return res.status(404).json({ msg: "Lifestyle not found" });
    }

    if (!problem) {
      return res.status(400).json({ msg: "Missing problem field" });
    }

    let targetObjective;

    if (!layer2id) {
      return res.status(400).json({ msg: "layer2id is required" });
    }

    targetObjective = lifestyle.objective.find(
      (obj) => obj._id.toString() === layer2id
    );
    if (!targetObjective) {
      return res
        .status(400)
        .json({ msg: "Objective not found for the given layer2id" });
    }

    if (layer2id && !layer3id && !layer4id) {
      targetObjective.problem = problem;
    } else if (layer2id && layer3id && !layer4id) {
      const nestedObjective = targetObjective.objective.find(
        (obj) => obj._id.toString() === layer3id
      );
      if (!nestedObjective) {
        return res
          .status(400)
          .json({ msg: "Specified nested objective not found" });
      }
      nestedObjective.problem = problem;
    } else if (layer2id && layer3id && layer4id) {
      const nestedObjective = targetObjective.objective.find(
        (obj) => obj._id.toString() === layer3id
      );
      if (!nestedObjective || !nestedObjective.objective) {
        return res
          .status(400)
          .json({ msg: "Nested objective array not found" });
      }

      const lastNestedObjective =
        nestedObjective.objective[nestedObjective.objective.length - 1];
      if (!lastNestedObjective) {
        return res.status(400).json({ msg: "Last nested objective not found" });
      }
      lastNestedObjective.problem = problem;
    } else {
      return res.status(400).json({ msg: "Invalid request parameters" });
    }

    lifestyle.markModified("objective");
    await lifestyle.save();

    res.status(200).json({
      msg: "Objective entry updated successfully",
      updatedData: lifestyle,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating objective entry",
      details: err.message,
    });
  }
};

const updateObjectiveLifeStyle = async (req, res) => {
  try {
    const { id } = req.params;
    const { objective } = req.body;
    console.log("id", id, "objective", objective);
    const lifestyle = await LifeStyleModel.findById(id);
    lifestyle?.innerData?.push(...innerData);
    const newLifeStyle = await lifestyle.save();
    res.status(httpStatus.CREATED).json({
      msg: "Lifestyle Updated Objective Successfully",
      data: newLifeStyle,
    });
  } catch (error) {
    console.error("Error storing Lifestyle Objective:", error);
    res.status(400).json({ error: error.message });
  }
};

const createLifeStyle = async (req, res) => {
  try {
    const {
      problem,
      answerType,
      departmentId,
      consultantId,
      objective,
      notes,
    } = req.body;

    console.log("req.body", req.body);

    if (!problem || !answerType || !departmentId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "Missing required fields: problem, answerType, or departmentId",
      });
    }

    let finalObjective = [];
    let finalNote = "";

    if (answerType.toLowerCase() === "subjective") {
      finalNote = notes || "";
    } else {
      finalObjective = Array.isArray(objective) ? objective : [];
    }

    const newLifeStyle = new LifeStyleModel({
      problem,
      answerType,
      departmentId,
      consultantId,
      objective: finalObjective,
      note: finalNote,
    });

    const savedLifeStyle = await newLifeStyle.save();

    res.status(httpStatus.CREATED).json({
      msg: "Lifestyle Added Successfully",
      data: savedLifeStyle,
    });
  } catch (error) {
    console.error("Error storing Lifestyle:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong while storing lifestyle data.",
      error: error.message,
    });
  }
};

const getAllLifeStyle = async (req, res) => {
  try {
    const lifeStyles = await LifeStyleModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: lifeStyles });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateSubjectiveLifestyleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { answerType, objective, problem } = req.body;
    console.log(objective);

    if (!answerType || !problem) {
      return res.status(400).json({
        message: "Please send answerType and problem",
      });
    }

    const lifestyle = await LifeStyleModel.findById(id);
    if (!lifestyle) {
      return res.status(404).json({
        message: "Lifestyle not found",
      });
    }

    lifestyle.answerType = answerType;
    lifestyle.problem = problem;
    lifestyle.objective =
      answerType.toLowerCase() === "objective" ? objective : [];
    lifestyle.notes = "";

    await lifestyle.save();

    return res.status(200).json({
      message: "Lifestyle updated successfully",
      lifestyle,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const addLayer2SubjectiveLifestyle = async (req, res) => {
  try {
    const { id } = req.params;
    const { objective, objectiveId } = req.body;

    console.log("addLayer2SubjectiveLifestyle>>>", req.body);
    if (!objective || !objectiveId) {
      return res
        .status(400)
        .json({ message: "objective or objectiveId not found" });
    }

    const lifestyle = await LifeStyleModel.findById(id);
    if (!lifestyle) {
      return res.status(404).json({ message: "Lifestyle not found" });
    }

    const target = lifestyle.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );

    if (!target) {
      return res.status(404).json({ message: "Objective not found" });
    }

    target.objective = objective;

    await lifestyle.save();

    return res.status(200).json({
      message: "Layer 2 objective added successfully",
      data: lifestyle,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const addLayer3SubjectiveLifestyle = async (req, res) => {
  try {
    const { id } = req.params;
    const { objective, objectiveId, subObjectiveId } = req.body;
    console.log("addLayer3SubjectiveLifestyle>>>>", req.body);

    if (!objective) {
      return res.status(400).json({ message: "Objective data is required" });
    }

    const lifestyle = await LifeStyleModel.findById(id);
    if (!lifestyle) {
      return res.status(404).json({ message: "Lifestyle not found" });
    }

    const layer1 = lifestyle.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!layer1) {
      return res.status(404).json({ message: "Layer 1 objective not found" });
    }

    const layer2 = layer1.objective.find(
      (obj) => obj._id.toString() === subObjectiveId
    );
    if (!layer2) {
      return res.status(404).json({ message: "Layer 2 objective not found" });
    }

    layer2.objective = objective;
    await lifestyle.save();
    return res.status(200).json({
      message: "Layer 3 objective added successfully",
      lifestyle,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateLifeStyleById = async (req, res) => {
  const { id } = req.params;
  const { objective } = req.body;
  const { layer2Data } = req.body;
  console.log(layer2Data);

  console.log("layer2Data");

  if (!objective && layer2Data) {
    try {
      const lifestyle = await LifeStyleModel.findById(id);
      if (!lifestyle) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ msg: "Lifestyle not found" });
      }

      const target = lifestyle.objective.find(
        (obj) => obj._id.toString() === layer2Data.objective._id
      );

      if (!target) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ msg: "Target objective not found in lifestyle.objective" });
      }

      const newChildren = layer2Data.objective.objective;
      if (!Array.isArray(newChildren)) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ msg: "layer2Data.objective.objective must be an array" });
      }

      newChildren.forEach((child) => {
        if (child.problem && child.answerType) {
          target.objective.push({
            problem: child.problem,
            answerType: child.answerType,
            objective: Array.isArray(child.objective) ? child.objective : [],
          });
        }
      });

      const updated = await lifestyle.save();

      return res.status(httpStatus.OK).json({
        msg: "Child objectives added to target objective",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating lifestyle:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        msg: "Internal server error",
        error: error.message,
      });
    }
  }

  console.log("objective---", objective);
  try {
    const lifestyle = await LifeStyleModel.findById(id);
    if (!lifestyle) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Lifestyle not found" });
    }

    if (!Array.isArray(objective) || objective.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "",
      });
    }

    objective.forEach((obj) => {
      if (obj.problem && obj.answerType) {
        lifestyle.objective.push({
          problem: obj.problem,
          answerType: obj.answerType,
          objective: Array.isArray(obj.objective) ? obj.objective : [],
        });
      }
    });

    const updatedLifestyle = await lifestyle.save();

    return res.status(httpStatus.OK).json({
      msg: "Objectives added to first layer",
      data: updatedLifestyle,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const updateObjectiveLayer = async (req, res) => {
  try {
    const { addlayer } = req.body;
    const { id } = req.params;

    console.log("addlayer>>>>>", addlayer);
    console.log("req.body", req.body);

    const mainDoc = await LifeStyleModel.findById(id);
    if (!mainDoc) {
      return res.status(404).json({ message: "Main document not found" });
    }

    if (addlayer === 1) {
      console.log("Layer 1");

      mainDoc.objective.push(...req.body.objective);

      await mainDoc.save();

      return res.status(200).json({
        message: "Objectives added successfully",
        addlayer,
        updated: mainDoc,
      });
    } else if (addlayer === 2) {
      console.log("Layer 1");

      const targetId = new mongoose.Types.ObjectId(req.body.objective._id);

      const targetObj = mainDoc.objective.find(
        (obj) => obj._id.toString() === targetId.toString()
      );

      if (!targetObj) {
        return res.status(404).json({ message: "Layer 1 objective not found" });
      }

      targetObj.objective.push(...req.body.objective.objective);

      await mainDoc.save();

      const lastInserted = targetObj.objective[targetObj.objective.length - 1];

      return res.status(200).json({
        message: "Objectives added successfully",
        addlayer,
        updated: lastInserted,
      });
    } else if (addlayer === 3) {
      console.log("Layer 3");

      const layer1Id = req.body.objective._id;
      const layer2Id = req.body.objective.objective._id;
      const newObjectives = req.body.objective.objective.objective;

      const targetLevel1 = mainDoc.objective.find(
        (obj) => obj._id.toString() === layer1Id
      );
      if (!targetLevel1) {
        return res.status(404).json({ message: "Layer 1 objective not found" });
      }

      const targetLevel2 = targetLevel1.objective.find(
        (obj) => obj._id.toString() === layer2Id
      );
      if (!targetLevel2) {
        return res.status(404).json({ message: "Layer 2 objective not found" });
      }

      targetLevel2.objective.push(...newObjectives);

      await mainDoc.save();

      const lastInserted =
        targetLevel2.objective[targetLevel2.objective.length - 1];

      return res.status(200).json({
        message: "Objectives added to Layer 3",
        addlayer,
        updated: lastInserted,
      });
    }

    await mainDoc.save();
    return res
      .status(200)
      .json({ message: "Objective added successfully", data: mainDoc });
  } catch (err) {
    console.error("Error adding objective:", err);
    return res.status(500).json({ message: err.message });
  }
};

const updateLifeStyleByIdForLastLayer = async (req, res) => {
  const { id } = req.params;
  const { objective, _id } = req.body;

  console.log("objectives", objective);

  try {
    if (!objective || !Array.isArray(objective.objective)) {
      return res.status(400).json({ msg: "Invalid or missing objective data" });
    }

    const updatedLifeStyle = await LifeStyleModel.findOneAndUpdate(
      {
        _id: id,
        "objective._id": _id,
        "objective.objective._id": objective._id,
      },
      {
        $push: {
          "objective.$.objective.$[obj].objective": {
            $each: objective.objective.map((newObj) => ({
              problem: newObj.problem,
              answerType: newObj.answerType,
              objective: Array.isArray(newObj.objective)
                ? newObj.objective
                : [],
            })),
          },
        },
      },
      {
        new: true,
        arrayFilters: [{ "obj._id": objective._id }],
      }
    );

    if (!updatedLifeStyle) {
      return res
        .status(404)
        .json({ msg: "Objective with specified _id not found" });
    }

    return res.status(200).json({
      msg: "Objectives added successfully",
      data: updatedLifeStyle,
    });
  } catch (error) {
    console.error("❌ Error updating lifeStyle:", error);
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const addPersnalHistory = async (req, res) => {
  try {
    const { openData, userId, patientId, lifeStyleConfigId } = req.body;
    console.log("req.body>>>>", req.body);

    console.log("📋 Full Objective:", JSON.stringify(openData, null, 2));

    if (!openData || !openData.problem || !openData.answerType) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const existingEntry = await LifeStyleHistoryModelForPatient.findOne({
      consultantId: userId,
      PatientId: patientId,
      lifeStyleConfigId: lifeStyleConfigId,
    });

    if (existingEntry) {
      console.log("in exist ----------");

      existingEntry.answerType = openData.answerType;
      existingEntry.problem = openData.problem;
      existingEntry.objective = openData.objective || [];

      const updatedEntry = await existingEntry.save();

      console.log("✅ Lifestyle history updated:", updatedEntry);

      return res.status(200).json({
        message: "Lifestyle history updated successfully.",
        data: updatedEntry,
      });
    }

    const newEntry = new LifeStyleHistoryModelForPatient({
      lifeStyleConfigId,
      consultantId: userId,
      PatientId: patientId,
      answerType: openData.answerType,
      problem: openData.problem,
      objective: openData.objective || [],
    });

    await newEntry.save();

    console.log("✅ New lifestyle history created:", newEntry);

    return res.status(201).json({
      message: "Lifestyle history saved successfully.",
      data: newEntry,
    });
  } catch (error) {
    console.error("❌ Error in addPersnalHistory:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deletelifeStylePersonalHistory = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Deleting lifestyle history with ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(id);
    console.log("Deleting lifestyle history with ID:", objectId);

    const deletedRecord =
      await LifeStyleHistoryModelForPatient.findByIdAndDelete(objectId);

    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
      data: deletedRecord,
    });
  } catch (error) {
    console.error("Error deleting lifestyle history:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const GetpersonalHistorybypatientId = async (req, res) => {
  console.log("GetpersonalHistorybypatientId", req.params.id);
  try {
    const lifeStyles = await LifeStyleHistoryModelForPatient.find({
      PatientId: req.params.id,
    });
    res.status(httpStatus.OK).json({ data: lifeStyles });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteLifeStyleByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await LifeStyleModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Lifestyle found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Lifestyle deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting Lifestyle",
      details: err.message,
    });
  }
};

const GetMostUsedLifeStyle = async (req, res) => {
  try {
    const adminId =
      req.query.adminId || req.body?.adminId || req.params.adminId;
    const { id } = req.params;
    let query = { delete: false };
    if (adminId) {
      query.adminId = adminId;
    } else {
      query.departmentId = id;
    }
    const lifeStyles = await LifeStyleModel.find(query)
      .sort({ createdAt: -1 })
      .limit(15);
    res.status(httpStatus.OK).json({ data: lifeStyles });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteGynacHistoryFormHistory = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Deleting lifestyle history with ID:", id);

    const deletedRecord = await GynacPatientModel.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
      data: deletedRecord,
    });
  } catch (error) {
    console.error("Error deleting lifestyle history:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const deleteGynacObjectiveEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params;

    const gynacHistory = await GynacHistoryModel.findById(id);

    console.log("deleteGynacObjectiveEntriesByIndex", req.body);

    if (!gynacHistory) {
      return res.status(404).json({ msg: "Gynac history not found" });
    }

    const idsToDelete = req.body?.ids || [];
    console.log("IDs to delete:", idsToDelete);

    if (!Array.isArray(idsToDelete) || idsToDelete.length === 0) {
      return res
        .status(400)
        .json({ msg: "IDs array is required and must not be empty" });
    }

    const deleteObjectivesById = (objectives) => {
      for (let i = objectives.length - 1; i >= 0; i--) {
        if (idsToDelete.includes(objectives[i]._id.toString())) {
          objectives.splice(i, 1);
        } else if (Array.isArray(objectives[i].objective)) {
          deleteObjectivesById(objectives[i].objective);
        }
      }
    };

    deleteObjectivesById(gynacHistory.objective);

    gynacHistory.markModified("objective");
    await gynacHistory.save();

    res.status(200).json({
      msg: "Objective entries deleted successfully",
      updatedData: gynacHistory,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting objective entries",
      details: err.message,
    });
  }
};
const deleteGynacInnerObjectiveDataEntries = async (req, res) => {
  try {
    const { id } = req.params;
    const { objectiveId, innerObjectiveId, innerObjectiveDataId } =
      req.body.ids;

    console.log("deleteGynacInnerObjectiveDataEntries", req.body);

    if (
      !objectiveId ||
      !innerObjectiveId ||
      !Array.isArray(innerObjectiveDataId) ||
      innerObjectiveDataId.length === 0
    ) {
      return res.status(400).json({
        msg: "Invalid request data: objectiveId, innerObjectiveId, and non-empty innerObjectiveDataId array are required",
        success: false,
      });
    }

    const gynacHistory = await GynacHistoryModel.findById(id);
    if (!gynacHistory) {
      return res
        .status(404)
        .json({ msg: "Gynac history not found", success: false });
    }

    const objectiveItem = gynacHistory.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!objectiveItem) {
      return res.status(400).json({
        msg: "Objective not found for the given objectiveId",
        success: false,
      });
    }

    const innerObjectiveItem = objectiveItem.objective.find(
      (obj) => obj._id.toString() === innerObjectiveId
    );
    if (!innerObjectiveItem) {
      return res.status(400).json({
        msg: "Inner objective not found for the given innerObjectiveId",
        success: false,
      });
    }

    if (
      !innerObjectiveItem.objective ||
      !Array.isArray(innerObjectiveItem.objective)
    ) {
      return res.status(400).json({
        msg: "Nested objective array not found in the inner objective",
        success: false,
      });
    }

    innerObjectiveDataId.forEach((idToDelete) => {
      const index = innerObjectiveItem.objective.findIndex(
        (data) => data._id.toString() === idToDelete
      );
      if (index !== -1) {
        innerObjectiveItem.objective.splice(index, 1);
      }
    });

    gynacHistory.markModified("objective");
    await gynacHistory.save();

    res.status(200).json({
      msg: "Inner objective data entries deleted successfully",
      updatedData: gynacHistory,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting inner objective data entries",
      details: err.message,
      success: false,
    });
  }
};
const deleteGynacObjectiveInnerDataEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params;
    const { objectiveId, innerDataId } = req.body?.ids;

    console.log("deleteGynacObjectiveInnerDataEntriesByIndex", req.body?.ids);

    if (
      !objectiveId ||
      !Array.isArray(innerDataId) ||
      innerDataId.length === 0
    ) {
      return res.status(400).json({
        msg: "Invalid request data: objectiveId and non-empty innerDataId array are required",
        success: false,
      });
    }

    const gynacHistory = await GynacHistoryModel.findById(id);
    if (!gynacHistory) {
      return res
        .status(404)
        .json({ msg: "Gynac history not found", success: false });
    }

    const objectiveItem = gynacHistory.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!objectiveItem) {
      return res.status(400).json({
        msg: "Objective not found for the given objectiveId",
        success: false,
      });
    }

    if (!Array.isArray(objectiveItem.objective)) {
      return res.status(400).json({
        msg: "innerData array not found in the objective",
        success: false,
      });
    }

    innerDataId.forEach((idToDelete) => {
      const index = objectiveItem.objective.findIndex(
        (data) => data._id.toString() === idToDelete
      );
      if (index !== -1) {
        objectiveItem.objective.splice(index, 1);
      }
    });

    gynacHistory.markModified("objective");
    await gynacHistory.save();

    res.status(200).json({
      msg: "InnerData entries deleted successfully",
      updatedData: gynacHistory,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting objective entries",
      details: err.message,
      success: false,
    });
  }
};
const editGynacObjectiveInnerDataEntry = async (req, res) => {
  try {
    console.log("editGynacObjectiveInnerDataEntry", req.body);
    const { id } = req.params;
    const { objectiveIndex, innerDataIndex, data } = req.body;

    if (
      typeof objectiveIndex !== "number" ||
      typeof innerDataIndex !== "number" ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid request data", success: false });
    }

    const gynacHistory = await GynacHistoryModel.findById(id);
    if (!gynacHistory) {
      return res
        .status(404)
        .json({ msg: "Gynac history not found", success: false });
    }

    if (objectiveIndex < 0 || objectiveIndex >= gynacHistory.objective.length) {
      return res
        .status(400)
        .json({ msg: "Invalid objective index", success: false });
    }

    const objectiveItem = gynacHistory.objective[objectiveIndex];

    if (
      !Array.isArray(objectiveItem.objective) ||
      innerDataIndex < 0 ||
      innerDataIndex >= objectiveItem.objective.length
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid innerData index", success: false });
    }

    objectiveItem.objective[innerDataIndex].data = data;

    gynacHistory.markModified("objective");

    await gynacHistory.save();

    res.status(200).json({
      msg: "InnerData entry updated successfully",
      updatedData: gynacHistory,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating innerData entry",
      details: err.message,
      success: false,
    });
  }
};
const updateGynacObjectiveEntryByIndex = async (req, res) => {
  try {
    const { id } = req.params;
    const { problem, layer2id, layer3id, layer4id } = req.body;
    console.log("API called to update Gynac objective");
    console.log(id, layer2id, layer3id, layer4id);

    const gynacHistory = await GynacHistoryModel.findById(id);

    if (!gynacHistory) {
      return res.status(404).json({ msg: "Gynac history not found" });
    }

    if (!problem) {
      return res.status(400).json({ msg: "Missing problem field" });
    }

    if (!layer2id) {
      return res.status(400).json({ msg: "layer2id is required" });
    }

    let targetObjective = gynacHistory.objective.find(
      (obj) => obj._id.toString() === layer2id
    );
    if (!targetObjective) {
      return res
        .status(400)
        .json({ msg: "Objective not found for the given layer2id" });
    }

    if (layer2id && !layer3id && !layer4id) {
      targetObjective.problem = problem;
    } else if (layer2id && layer3id && !layer4id) {
      const nestedObjective = targetObjective.objective.find(
        (obj) => obj._id.toString() === layer3id
      );
      if (!nestedObjective) {
        return res
          .status(400)
          .json({ msg: "Specified nested objective not found" });
      }
      nestedObjective.problem = problem;
    } else if (layer2id && layer3id && layer4id) {
      const nestedObjective = targetObjective.objective.find(
        (obj) => obj._id.toString() === layer3id
      );
      if (!nestedObjective || !Array.isArray(nestedObjective.objective)) {
        return res
          .status(400)
          .json({ msg: "Nested objective array not found" });
      }
      const lastNestedObjective = nestedObjective.objective.find(
        (obj) => obj._id.toString() === layer4id
      );
      if (!lastNestedObjective) {
        return res.status(400).json({ msg: "Last nested objective not found" });
      }
      lastNestedObjective.problem = problem;
    } else {
      return res.status(400).json({ msg: "Invalid request parameters" });
    }

    gynacHistory.markModified("objective");
    await gynacHistory.save();

    res.status(200).json({
      msg: "Objective entry updated successfully",
      updatedData: gynacHistory,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating objective entry",
      details: err.message,
      success: false,
    });
  }
};
const updateObjectiveGynac = async (req, res) => {
  try {
    const { id } = req.params;
    const { objective } = req.body;

    console.log("add layer one >>>id:", id, "objective:", objective);

    if (!Array.isArray(objective)) {
      return res.status(400).json({ msg: "Objective must be an array" });
    }

    const gynac = await GynacHistoryModel.findById(id);
    if (!gynac) {
      return res.status(404).json({ msg: "Gynac history not found" });
    }

    gynac.objective.push(...objective);

    const updatedGynac = await gynac.save();

    res.status(201).json({
      msg: "Gynac History Objective Updated Successfully",
      data: updatedGynac,
    });
  } catch (error) {
    console.error("Error updating Gynac Objective:", error);
    res.status(400).json({ error: error.message });
  }
};
const createGynacHistory = async (req, res) => {
  try {
    const {
      problem,
      answerType,
      departmentId,
      consultantId,
      objective,
      notes,
    } = req.body;
    console.log("req.body", req.body);

    if (!problem || !answerType || !departmentId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "Missing required fields: problem, answerType, or departmentId",
      });
    }

    let finalObjective = [];
    let finalNotes = "";

    if (answerType.toLowerCase() === "subjective") {
      finalNotes = notes || "";
    } else {
      finalObjective = Array.isArray(objective) ? objective : [];
    }

    const newGynac = new GynacHistoryModel({
      problem,
      answerType,
      departmentId,
      consultantId,
      objective: finalObjective,
      notes: finalNotes,
    });

    const savedGynac = await newGynac.save();

    res.status(httpStatus.CREATED).json({
      msg: "Gynac History Added Successfully",
      data: savedGynac,
    });
  } catch (error) {
    console.error("Error storing Gynac History:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong while storing gynac history data.",
      error: error.message,
    });
  }
};
const getAllGynacHistory = async (req, res) => {
  console.log("request and response data>>>>>>>>>", req);

  try {
    const gynacHistories = await GynacHistoryModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: gynacHistories });
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
    });
  }
};
const updateSubjectiveGynacHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { answerType, objective, problem } = req.body;
    console.log(objective);

    if (!answerType || !problem) {
      return res.status(400).json({
        message: "Please send answerType and problem",
      });
    }

    const gynacHistory = await GynacHistoryModel.findById(id);
    if (!gynacHistory) {
      return res.status(404).json({
        message: "Gynac History not found",
      });
    }

    gynacHistory.answerType = answerType;
    gynacHistory.problem = problem;
    gynacHistory.objective =
      answerType.toLowerCase() === "objective" ? objective : [];
    gynacHistory.notes = "";

    await gynacHistory.save();

    return res.status(200).json({
      message: "Gynac History updated successfully",
      data: gynacHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const addLayer2SubjectiveGynacHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { objective, objectiveId } = req.body;

    console.log("reqfro gynac>>", req.body);
    console.log("objective >>>>>>>>>>>>>>>", objective, objectiveId);

    if (!objective || !objectiveId) {
      return res
        .status(400)
        .json({ message: "objective or objectiveId not found" });
    }

    const gynacHistory = await GynacHistoryModel.findById(id);
    if (!gynacHistory) {
      return res.status(404).json({ message: "Gynac History not found" });
    }

    const target = gynacHistory.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!target) {
      return res
        .status(404)
        .json({ message: "Objective not found in Gynac History" });
    }

    target.objective = objective;

    await gynacHistory.save();

    return res.status(200).json({
      message: "Layer 2 objective added successfully",
      data: gynacHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const addLayer3SubjectiveGynac = async (req, res) => {
  try {
    const { id } = req.params;
    const { objective, objectiveId, subObjectiveId } = req.body;

    if (!objective) {
      return res.status(400).json({ message: "Objective data is required" });
    }

    const gynacHistory = await GynacHistoryModel.findById(id);
    if (!gynacHistory) {
      return res.status(404).json({ message: "Gynac history not found" });
    }

    const layer1 = gynacHistory.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!layer1) {
      return res.status(404).json({ message: "Layer 1 objective not found" });
    }

    const layer2 = layer1.objective.find(
      (obj) => obj._id.toString() === subObjectiveId
    );
    if (!layer2) {
      return res.status(404).json({ message: "Layer 2 objective not found" });
    }

    layer2.objective = objective;
    await gynacHistory.save();
    return res.status(200).json({
      message: "Layer 3 objective added successfully",
      gynacHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const updateGynacHistoryById = async (req, res) => {
  const { id } = req.params;
  const { objective } = req.body;
  const { layer2Data } = req.body;

  console.log(layer2Data);
  console.log("layer2Data");

  if (!objective && layer2Data) {
    try {
      const gynacHistory = await GynacHistoryModel.findById(id);
      if (!gynacHistory) {
        return res.status(404).json({ msg: "Gynac history not found" });
      }

      const target = gynacHistory.objective.find(
        (obj) => obj._id.toString() === layer2Data.objective._id
      );

      if (!target) {
        return res.status(404).json({
          msg: "Target objective not found in gynacHistory.objective",
        });
      }

      const newChildren = layer2Data.objective.objective;
      if (!Array.isArray(newChildren)) {
        return res
          .status(400)
          .json({ msg: "layer2Data.objective.objective must be an array" });
      }

      newChildren.forEach((child) => {
        if (child.problem && child.answerType) {
          target.objective.push({
            problem: child.problem,
            answerType: child.answerType,
            objective: Array.isArray(child.objective) ? child.objective : [],
          });
        }
      });

      const updated = await gynacHistory.save();

      return res.status(200).json({
        msg: "Child objectives added to target objective",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating gynacHistory:", error);
      return res.status(500).json({
        msg: "Internal server error",
        error: error.message,
      });
    }
  }

  console.log("objective---", objective);
  try {
    const gynacHistory = await GynacHistoryModel.findById(id);
    if (!gynacHistory) {
      return res.status(404).json({ msg: "Gynac history not found" });
    }

    if (!Array.isArray(objective) || objective.length === 0) {
      return res.status(400).json({
        msg: "Objective must be a non-empty array",
      });
    }

    objective.forEach((obj) => {
      if (obj.problem && obj.answerType) {
        gynacHistory.objective.push({
          problem: obj.problem,
          answerType: obj.answerType,
          objective: Array.isArray(obj.objective) ? obj.objective : [],
        });
      }
    });

    const updatedGynacHistory = await gynacHistory.save();

    return res.status(200).json({
      msg: "Objectives added to first layer",
      data: updatedGynacHistory,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};
const updateObjectiveLayerForGynacHistory = async (req, res) => {
  try {
    const { addlayer } = req.body;
    const { id } = req.params;

    console.log("addlayer", addlayer);
    console.log("req.body one and tow>>>>>>>", req.body);

    const mainDoc = await GynacHistoryModel.findById(id);
    if (!mainDoc) {
      return res.status(404).json({ message: "Main document not found" });
    }

    if (addlayer === 1) {
      console.log("Layer 1");

      mainDoc.objective.push(...req.body.objective);

      await mainDoc.save();

      return res.status(200).json({
        message: "Objectives added successfully",
        addlayer,
        updated: mainDoc,
      });
    } else if (addlayer === 2) {
      console.log("Layer 2");

      const targetId = new mongoose.Types.ObjectId(req.body.objective._id);

      const targetObj = mainDoc.objective.find(
        (obj) => obj._id.toString() === targetId.toString()
      );

      if (!targetObj) {
        return res.status(404).json({ message: "Layer 1 objective not found" });
      }

      targetObj.objective.push(...req.body.objective.objective);

      await mainDoc.save();

      const lastInserted = targetObj.objective[targetObj.objective.length - 1];

      return res.status(200).json({
        message: "Objectives added successfully",
        addlayer,
        updated: lastInserted,
      });
    } else if (addlayer === 3) {
      console.log("Layer 3");

      const layer1Id = req.body.objective._id;
      const layer2Id = req.body.objective.objective._id;
      const newObjectives = req.body.objective.objective.objective;

      const targetLevel1 = mainDoc.objective.find(
        (obj) => obj._id.toString() === layer1Id
      );
      if (!targetLevel1) {
        return res.status(404).json({ message: "Layer 1 objective not found" });
      }

      const targetLevel2 = targetLevel1.objective.find(
        (obj) => obj._id.toString() === layer2Id
      );
      if (!targetLevel2) {
        return res.status(404).json({ message: "Layer 2 objective not found" });
      }

      targetLevel2.objective.push(...newObjectives);

      await mainDoc.save();

      const lastInserted =
        targetLevel2.objective[targetLevel2.objective.length - 1];

      return res.status(200).json({
        message: "Objectives added to Layer 3",
        addlayer,
        updated: lastInserted,
      });
    }

    await mainDoc.save();
    return res
      .status(200)
      .json({ message: "Objective added successfully", data: mainDoc });
  } catch (err) {
    console.error("Error adding objective:", err);
    return res.status(500).json({ message: err.message });
  }
};
const updateGynacHistoryByIdForLastLayer = async (req, res) => {
  const { id } = req.params;
  const { objective, _id } = req.body;

  console.log("objectives", objective);

  try {
    if (!objective || !Array.isArray(objective.objective)) {
      return res.status(400).json({ msg: "Invalid or missing objective data" });
    }

    const updatedGynacHistory = await GynacHistoryModel.findOneAndUpdate(
      {
        _id: id,
        "objective._id": _id,
        "objective.objective._id": objective._id,
      },
      {
        $push: {
          "objective.$.objective.$[obj].objective": {
            $each: objective.objective.map((newObj) => ({
              problem: newObj.problem,
              answerType: newObj.answerType,
              objective: Array.isArray(newObj.objective)
                ? newObj.objective
                : [],
            })),
          },
        },
      },
      {
        new: true,
        arrayFilters: [{ "obj._id": objective._id }],
      }
    );

    if (!updatedGynacHistory) {
      return res
        .status(404)
        .json({ msg: "Objective with specified _id not found" });
    }

    return res.status(200).json({
      msg: "Objectives added successfully",
      data: updatedGynacHistory,
    });
  } catch (error) {
    console.error("❌ Error updating Gynac History:", error);
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const addGynacHistoryForPatient = async (req, res) => {
  try {
    const { openData, userId, patientId, gynacleConfigId } = req.body;
    console.log("addGynacHistoryForPatient>>>>>>>>", JSON.stringify(req.body));

    if (!openData || !openData.problem || !openData.answerType) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const existingEntry = await GynacPatientModel.findOne({
      consultantId: userId,
      PatientId: patientId,
      gynacleConfigId: gynacleConfigId,
    });

    if (existingEntry) {
      existingEntry.answerType = openData.answerType;
      existingEntry.problem = openData.problem;
      existingEntry.objective = openData.objective || [];

      const updatedEntry = await existingEntry.save();

      return res.status(200).json({
        message: "Gynac history updated successfully.",
        data: updatedEntry,
      });
    }

    const newEntry = new GynacPatientModel({
      gynacleConfigId: gynacleConfigId,
      consultantId: userId,
      PatientId: patientId,
      answerType: openData.answerType,
      problem: openData.problem,
      objective: openData.objective || [],
    });

    await newEntry.save();

    res.status(201).json({
      message: "Gynac history saved successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("❌ Error saving gynac history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getGynacHistoryByPatientId = async (req, res) => {
  try {
    const gynacHistory = await GynacPatientModel.find({
      PatientId: req.params.id,
    });
    console.log("gynacHistory", gynacHistory);
    res.status(200).json({ data: gynacHistory });
  } catch (error) {
    console.error("Error fetching gynac history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteGynacHistoryByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await GynacHistoryModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ msg: "No Gynac history found with the provided IDs" });
    }

    res.status(200).json({ msg: "Gynac history deleted successfully", result });
  } catch (err) {
    res.status(500).json({
      error: "Error in deleting Gynac history",
      details: err.message,
    });
  }
};
const GetMostUsedGynacHistory = async (req, res) => {
  try {
    const adminId =
      req.query.adminId || req.body?.adminId || req.params.adminId;
    const { id } = req.params;
    let query = { delete: false };
    if (adminId) {
      query.adminId = adminId;
    } else {
      query.departmentId = id;
    }
    const gynacHistories = await GynacHistoryModel.find(query)
      .sort({ createdAt: -1 })
      .limit(15);
    res.status(httpStatus.OK).json({ data: gynacHistories });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteHistoryFormHistory = async (Model, req, res) => {
  try {
    const id = req.params.id;
    console.log("Deleting nutri:", id, Model);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    const objectId = new mongoose.Types.ObjectId(id);
    console.log("Deleting record with ID:", objectId);

    const deletedRecord = await Model.findByIdAndDelete(objectId);

    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
      data: deletedRecord,
    });
  } catch (error) {
    console.error("Error deleting lifestyle history:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const deleteObjectiveEntriesByIndex = async (Model, req, res) => {
  try {
    const { id } = req.params;

    const otherHistory = await Model.findById(id);

    console.log("deleteOtherObjectiveEntriesByIndex", req.body);

    if (!otherHistory) {
      return res.status(404).json({ msg: "Other history not found" });
    }

    const idsToDelete = req.body?.ids || [];
    console.log("IDs to delete:", idsToDelete);

    if (!Array.isArray(idsToDelete) || idsToDelete.length === 0) {
      return res.status(400).json({
        msg: "IDs array is required and must not be empty",
      });
    }

    const deleteObjectivesById = (objectives) => {
      for (let i = objectives.length - 1; i >= 0; i--) {
        if (idsToDelete.includes(objectives[i]._id.toString())) {
          objectives.splice(i, 1);
        } else if (Array.isArray(objectives[i].objective)) {
          deleteObjectivesById(objectives[i].objective);
        }
      }
    };

    deleteObjectivesById(otherHistory.objective);

    otherHistory.markModified("objective");
    await otherHistory.save();

    res.status(200).json({
      msg: "Objective entries deleted successfully",
      updatedData: otherHistory,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting objective entries",
      details: err.message,
    });
  }
};

const deleteInnerObjectiveDataEntries = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { objectiveId, innerObjectiveId, innerObjectiveDataId } =
      req.body.ids;

    console.log("deleteOtherInnerObjectiveDataEntries", req.body);

    if (
      !objectiveId ||
      !innerObjectiveId ||
      !Array.isArray(innerObjectiveDataId) ||
      innerObjectiveDataId.length === 0
    ) {
      return res.status(400).json({
        msg: "Invalid request data: objectiveId, innerObjectiveId, and non-empty innerObjectiveDataId array are required",
        success: false,
      });
    }

    const otherHistory = await Model.findById(id);
    if (!otherHistory) {
      return res
        .status(404)
        .json({ msg: "Other history not found", success: false });
    }

    const objectiveItem = otherHistory.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!objectiveItem) {
      return res.status(400).json({
        msg: "Objective not found for the given objectiveId",
        success: false,
      });
    }

    const innerObjectiveItem = objectiveItem.objective.find(
      (obj) => obj._id.toString() === innerObjectiveId
    );
    if (!innerObjectiveItem) {
      return res.status(400).json({
        msg: "Inner objective not found for the given innerObjectiveId",
        success: false,
      });
    }

    if (
      !innerObjectiveItem.objective ||
      !Array.isArray(innerObjectiveItem.objective)
    ) {
      return res.status(400).json({
        msg: "Nested objective array not found in the inner objective",
        success: false,
      });
    }

    innerObjectiveDataId.forEach((idToDelete) => {
      const index = innerObjectiveItem.objective.findIndex(
        (data) => data._id.toString() === idToDelete
      );
      if (index !== -1) {
        innerObjectiveItem.objective.splice(index, 1);
      }
    });

    otherHistory.markModified("objective");
    await otherHistory.save();

    res.status(200).json({
      msg: "Inner objective data entries deleted successfully",
      updatedData: otherHistory,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting inner objective data entries",
      details: err.message,
      success: false,
    });
  }
};

const deleteObjectiveInnerDataEntriesByIndex = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { objectiveId, innerDataId } = req.body?.ids;

    console.log("deleteOtherObjectiveInnerDataEntriesByIndex", req.body?.ids);

    if (
      !objectiveId ||
      !Array.isArray(innerDataId) ||
      innerDataId.length === 0
    ) {
      return res.status(400).json({
        msg: "Invalid request data: objectiveId and non-empty innerDataId array are required",
        success: false,
      });
    }

    const otherHistory = await Model.findById(id);
    if (!otherHistory) {
      return res
        .status(404)
        .json({ msg: "Other history not found", success: false });
    }

    const objectiveItem = otherHistory.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!objectiveItem) {
      return res.status(400).json({
        msg: "Objective not found for the given objectiveId",
        success: false,
      });
    }

    if (!Array.isArray(objectiveItem.objective)) {
      return res.status(400).json({
        msg: "innerData array not found in the objective",
        success: false,
      });
    }

    innerDataId.forEach((idToDelete) => {
      const index = objectiveItem.objective.findIndex(
        (data) => data._id.toString() === idToDelete
      );
      if (index !== -1) {
        objectiveItem.objective.splice(index, 1);
      }
    });

    otherHistory.markModified("objective");
    await otherHistory.save();

    res.status(200).json({
      msg: "InnerData entries deleted successfully",
      updatedData: otherHistory,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting objective entries",
      details: err.message,
      success: false,
    });
  }
};

const editObjectiveInnerDataEntry = async (Model, req, res) => {
  try {
    console.log("editOtherObjectiveInnerDataEntry", req.body);
    const { id } = req.params;
    const { objectiveIndex, innerDataIndex, data } = req.body;

    if (
      typeof objectiveIndex !== "number" ||
      typeof innerDataIndex !== "number" ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid request data", success: false });
    }

    const otherHistory = await Model.findById(id);
    if (!otherHistory) {
      return res
        .status(404)
        .json({ msg: "Other history not found", success: false });
    }

    if (objectiveIndex < 0 || objectiveIndex >= otherHistory.objective.length) {
      return res
        .status(400)
        .json({ msg: "Invalid objective index", success: false });
    }

    const objectiveItem = otherHistory.objective[objectiveIndex];

    if (
      !Array.isArray(objectiveItem.objective) ||
      innerDataIndex < 0 ||
      innerDataIndex >= objectiveItem.objective.length
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid innerData index", success: false });
    }

    objectiveItem.objective[innerDataIndex].data = data;

    otherHistory.markModified("objective");

    await otherHistory.save();

    res.status(200).json({
      msg: "InnerData entry updated successfully",
      updatedData: otherHistory,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating innerData entry",
      details: err.message,
      success: false,
    });
  }
};

const updateObjectiveEntryByIndex = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { problem, layer2id, layer3id, layer4id } = req.body;
    console.log("API called to update Other objective");
    console.log(id, layer2id, layer3id, layer4id);

    const otherHistory = await Model.findById(id);

    if (!otherHistory) {
      return res.status(404).json({ msg: "Other history not found" });
    }

    if (!problem) {
      return res.status(400).json({ msg: "Missing problem field" });
    }

    if (!layer2id) {
      return res.status(400).json({ msg: "layer2id is required" });
    }

    let targetObjective = otherHistory.objective.find(
      (obj) => obj._id.toString() === layer2id
    );
    if (!targetObjective) {
      return res
        .status(400)
        .json({ msg: "Objective not found for the given layer2id" });
    }

    if (layer2id && !layer3id && !layer4id) {
      targetObjective.problem = problem;
    } else if (layer2id && layer3id && !layer4id) {
      const nestedObjective = targetObjective.objective.find(
        (obj) => obj._id.toString() === layer3id
      );
      if (!nestedObjective) {
        return res
          .status(400)
          .json({ msg: "Specified nested objective not found" });
      }
      nestedObjective.problem = problem;
    } else if (layer2id && layer3id && layer4id) {
      const nestedObjective = targetObjective.objective.find(
        (obj) => obj._id.toString() === layer3id
      );
      if (!nestedObjective || !Array.isArray(nestedObjective.objective)) {
        return res
          .status(400)
          .json({ msg: "Nested objective array not found" });
      }
      const lastNestedObjective = nestedObjective.objective.find(
        (obj) => obj._id.toString() === layer4id
      );
      if (!lastNestedObjective) {
        return res.status(400).json({ msg: "Last nested objective not found" });
      }
      lastNestedObjective.problem = problem;
    } else {
      return res.status(400).json({ msg: "Invalid request parameters" });
    }

    otherHistory.markModified("objective");
    await otherHistory.save();

    res.status(200).json({
      msg: "Objective entry updated successfully",
      updatedData: otherHistory,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating objective entry",
      details: err.message,
      success: false,
    });
  }
};

const updateObjective = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { objective } = req.body;

    console.log("id:", id, "objective:", objective);

    if (!Array.isArray(objective)) {
      return res.status(400).json({ msg: "Objective must be an array" });
    }

    const other = await Model.findById(id);
    if (!other) {
      return res.status(404).json({ msg: "Other history not found" });
    }

    other.objective.push(...objective);

    const updatedOther = await other.save();

    res.status(201).json({
      msg: "Other History Objective Updated Successfully",
      data: updatedOther,
    });
  } catch (error) {
    console.error("Error updating Other Objective:", error);
    res.status(400).json({ error: error.message });
  }
};
const createHistory = async (Model, req, res) => {
  try {
    const {
      problem,
      answerType,
      departmentId,
      consultantId,
      objective,
      notes,
    } = req.body;
    console.log("req.body>>>>>>>>>>>>", req.body);

    if (!problem || !answerType || !departmentId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "Missing required fields: problem, answerType, or departmentId",
      });
    }

    let finalObjective = [];
    let finalNotes = "";

    if (answerType.toLowerCase() === "subjective") {
      finalNotes = notes || "";
    } else {
      finalObjective = Array.isArray(objective) ? objective : [];
    }

    const newOther = new Model({
      problem,
      answerType,
      departmentId,
      consultantId,
      objective: finalObjective,
      notes: finalNotes,
    });

    const savedOther = await newOther.save();

    res.status(httpStatus.CREATED).json({
      msg: "Other History Added Successfully",
      data: savedOther,
    });
  } catch (error) {
    console.error("Error storing Other History:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong while storing other history data.",
      error: error.message,
    });
  }
};
const getAllHistory = async (Model, req, res) => {
  try {
    const gynacHistories = await Model.find({ delete: false });
    res.status(httpStatus.OK).json({ data: gynacHistories });
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
    });
  }
};
const updateSubjectiveById = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { answerType, objective, problem } = req.body;
    console.log(objective);

    if (!answerType || !problem) {
      return res.status(400).json({
        message: "Please send answerType and problem",
      });
    }

    const gynacHistory = await Model.findById(id);
    if (!gynacHistory) {
      return res.status(404).json({
        message: "Gynac History not found",
      });
    }

    gynacHistory.answerType = answerType;
    gynacHistory.problem = problem;
    gynacHistory.objective =
      answerType.toLowerCase() === "objective" ? objective : [];
    gynacHistory.notes = "";

    await gynacHistory.save();

    return res.status(200).json({
      message: "Gynac History updated successfully",
      data: gynacHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const addLayer2Subjective = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { objective, objectiveId } = req.body;

    console.log(objective, objectiveId);

    if (!objective || !objectiveId) {
      return res
        .status(400)
        .json({ message: "objective or objectiveId not found" });
    }

    const gynacHistory = await Model.findById(id);
    if (!gynacHistory) {
      return res.status(404).json({ message: "Gynac History not found" });
    }

    const target = gynacHistory.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!target) {
      return res
        .status(404)
        .json({ message: "Objective not found in Gynac History" });
    }

    target.objective = objective;

    await gynacHistory.save();

    return res.status(200).json({
      message: "Layer 2 objective added successfully",
      data: gynacHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const addLayer3Subjective = async (Model, req, res) => {
  try {
    const { id } = req.params;
    const { objective, objectiveId, subObjectiveId } = req.body;

    if (!objective) {
      return res.status(400).json({ message: "Objective data is required" });
    }

    const gynacHistory = await Model.findById(id);
    if (!gynacHistory) {
      return res.status(404).json({ message: "Gynac history not found" });
    }

    const layer1 = gynacHistory.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!layer1) {
      return res.status(404).json({ message: "Layer 1 objective not found" });
    }

    const layer2 = layer1.objective.find(
      (obj) => obj._id.toString() === subObjectiveId
    );
    if (!layer2) {
      return res.status(404).json({ message: "Layer 2 objective not found" });
    }

    layer2.objective = objective;
    await gynacHistory.save();
    return res.status(200).json({
      message: "Layer 3 objective added successfully",
      gynacHistory,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const updateHistoryById = async (Model, req, res) => {
  const { id } = req.params;
  const { objective } = req.body;
  const { layer2Data } = req.body;
  console.log(layer2Data);
  console.log("layer2Data");

  if (!objective && layer2Data) {
    try {
      const gynacHistory = await Model.findById(
        new mongoose.Types.ObjectId(id)
      );

      console.log("gynacHistory----", gynacHistory);
      if (!gynacHistory) {
        return res.status(404).json({ msg: "Gynac history not found" });
      }

      const target = gynacHistory.objective.find(
        (obj) => obj._id.toString() === layer2Data.objective._id
      );

      if (!target) {
        return res.status(404).json({
          msg: "Target objective not found in gynacHistory.objective",
        });
      }

      const newChildren = layer2Data.objective.objective;
      if (!Array.isArray(newChildren)) {
        return res
          .status(400)
          .json({ msg: "layer2Data.objective.objective must be an array" });
      }

      newChildren.forEach((child) => {
        if (child.problem && child.answerType) {
          target.objective.push({
            problem: child.problem,
            answerType: child.answerType,
            objective: Array.isArray(child.objective) ? child.objective : [],
          });
        }
      });

      const updated = await gynacHistory.save();

      return res.status(200).json({
        msg: "Child objectives added to target objective",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating gynacHistory:", error);
      return res.status(500).json({
        msg: "Internal server error",
        error: error.message,
      });
    }
  }

  console.log("objective---", objective);
  try {
    const gynacHistory = await GynacHistoryModel.findById(id);
    if (!gynacHistory) {
      return res.status(404).json({ msg: "Gynac history not found" });
    }

    if (!Array.isArray(objective) || objective.length === 0) {
      return res.status(400).json({
        msg: "Objective must be a non-empty array",
      });
    }

    objective.forEach((obj) => {
      if (obj.problem && obj.answerType) {
        gynacHistory.objective.push({
          problem: obj.problem,
          answerType: obj.answerType,
          objective: Array.isArray(obj.objective) ? obj.objective : [],
        });
      }
    });

    const updatedGynacHistory = await gynacHistory.save();

    return res.status(200).json({
      msg: "Objectives added to first layer",
      data: updatedGynacHistory,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};
const updateObjectiveLayerForHistory = async (Model, req, res) => {
  try {
    const { addlayer } = req.body;
    const { id } = req.params;

    console.log("addlayer", addlayer);
    console.log("req.body", req.body);

    const mainDoc = await Model.findById(id);
    if (!mainDoc) {
      return res.status(404).json({ message: "Main document not found" });
    }

    if (addlayer === 1) {
      console.log("Layer 1");

      mainDoc.objective.push(...req.body.objective);

      await mainDoc.save();

      return res.status(200).json({
        message: "Objectives added successfully",
        addlayer,
        updated: mainDoc,
      });
    } else if (addlayer === 2) {
      console.log("Layer 2");

      const targetId = new mongoose.Types.ObjectId(req.body.objective._id);

      const targetObj = mainDoc.objective.find(
        (obj) => obj._id.toString() === targetId.toString()
      );

      if (!targetObj) {
        return res.status(404).json({ message: "Layer 1 objective not found" });
      }

      targetObj.objective.push(...req.body.objective.objective);

      await mainDoc.save();

      const lastInserted = targetObj.objective[targetObj.objective.length - 1];

      return res.status(200).json({
        message: "Objectives added successfully",
        addlayer,
        updated: lastInserted,
      });
    } else if (addlayer === 3) {
      console.log("Layer 3");

      const layer1Id = req.body.objective._id;
      const layer2Id = req.body.objective.objective._id;
      const newObjectives = req.body.objective.objective.objective;

      const targetLevel1 = mainDoc.objective.find(
        (obj) => obj._id.toString() === layer1Id
      );
      if (!targetLevel1) {
        return res.status(404).json({ message: "Layer 1 objective not found" });
      }

      const targetLevel2 = targetLevel1.objective.find(
        (obj) => obj._id.toString() === layer2Id
      );
      if (!targetLevel2) {
        return res.status(404).json({ message: "Layer 2 objective not found" });
      }

      targetLevel2.objective.push(...newObjectives);

      await mainDoc.save();

      const lastInserted =
        targetLevel2.objective[targetLevel2.objective.length - 1];

      return res.status(200).json({
        message: "Objectives added to Layer 3",
        addlayer,
        updated: lastInserted,
      });
    }

    await mainDoc.save();
    return res
      .status(200)
      .json({ message: "Objective added successfully", data: mainDoc });
  } catch (err) {
    console.error("Error adding objective:", err);
    return res.status(500).json({ message: err.message });
  }
};
const updateHistoryByIdForLastLayer = async (Model, req, res) => {
  const { id } = req.params;
  const { objective, _id } = req.body;

  console.log("objectives", objective);

  try {
    if (!objective || !Array.isArray(objective.objective)) {
      return res.status(400).json({ msg: "Invalid or missing objective data" });
    }

    const updatedGynacHistory = await Model.findOneAndUpdate(
      {
        _id: id,
        "objective._id": _id,
        "objective.objective._id": objective._id,
      },
      {
        $push: {
          "objective.$.objective.$[obj].objective": {
            $each: objective.objective.map((newObj) => ({
              problem: newObj.problem,
              answerType: newObj.answerType,
              objective: Array.isArray(newObj.objective)
                ? newObj.objective
                : [],
            })),
          },
        },
      },
      {
        new: true,
        arrayFilters: [{ "obj._id": objective._id }],
      }
    );

    if (!updatedGynacHistory) {
      return res
        .status(404)
        .json({ msg: "Objective with specified _id not found" });
    }

    return res.status(200).json({
      msg: "Objectives added successfully",
      data: updatedGynacHistory,
    });
  } catch (error) {
    console.error("❌ Error updating Gynac History:", error);
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const addHistoryForPatient = async (Model, req, res) => {
  try {
    const { openData, userId, patientId, configId } = req.body;
    console.log(
      "add Obstetric History ForPatient >>>>",
      JSON.stringify(req.body)
    );
    if (!openData || !openData.problem || !openData.answerType) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const existingEntry = await Model.findOne({
      consultantId: userId,
      PatientId: patientId,
      configId: configId,
    });

    if (existingEntry) {
      existingEntry.answerType = openData.answerType;
      existingEntry.problem = openData.problem;
      existingEntry.objective = openData.objective || [];

      const updatedEntry = await existingEntry.save();

      return res.status(200).json({
        message: "Obstetric History updated successfully.",
        data: updatedEntry,
      });
    }

    const newEntry = new Model({
      configId: configId,
      consultantId: userId,
      PatientId: patientId,
      answerType: openData.answerType,
      problem: openData.problem,
      objective: openData.objective || [],
    });

    await newEntry.save();

    res.status(201).json({
      message: "Obstetr History saved successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("❌ Error saving history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getHistoryByPatientId = async (Model, req, res) => {
  try {
    const gynacHistory = await Model.find({ PatientId: req.params.id });

    res.status(200).json({ data: gynacHistory });
  } catch (error) {
    console.error("Error fetching gynac history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteHistoryByIds = async (Model, req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await Model.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ msg: "No  history found with the provided IDs" });
    }

    res.status(200).json({ msg: " history deleted successfully", result });
  } catch (err) {
    res.status(500).json({
      error: "Error in deleting Gynac history",
      details: err.message,
    });
  }
};
const GetMostUsedHistory = async (Model, req, res) => {
  try {
    const adminId =
      req.query.adminId || req.body?.adminId || req.params.adminId;
    const { id } = req.params;
    let query = { delete: false };
    if (adminId) {
      query.adminId = adminId;
    } else {
      query.departmentId = id;
    }
    const histories = await Model.find(query).sort({ createdAt: -1 }).limit(15);

    res.status(200).json({ data: histories });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

const deleteHistoryFormHistoryController = (req, res) =>
  deleteHistoryFormHistory(OtherHistoryModelForPatient, req, res);

const deleteOtherObjectiveEntriesByIndex = (req, res) =>
  deleteObjectiveEntriesByIndex(OtherHistoryModel, req, res);
const deleteOtherInnerObjectiveDataEntries = (req, res) =>
  deleteInnerObjectiveDataEntries(OtherHistoryModel, req, res);
const deleteOtherObjectiveInnerDataEntriesByIndex = (req, res) =>
  deleteObjectiveInnerDataEntriesByIndex(OtherHistoryModel, req, res);
const editOtherObjectiveInnerDataEntry = (req, res) =>
  editObjectiveInnerDataEntry(OtherHistoryModel, req, res);
const updateOtherObjectiveEntryByIndex = (req, res) =>
  updateObjectiveEntryByIndex(OtherHistoryModel, req, res);
const updateObjectiveOther = (req, res) =>
  updateObjective(OtherHistoryModel, req, res);
const createOtherHistory = (req, res) =>
  createHistory(OtherHistoryModel, req, res);
const getAllOtherHistory = (req, res) =>
  getAllHistory(OtherHistoryModel, req, res);
const updateSubjectiveOtherHistoryById = (req, res) =>
  updateSubjectiveById(OtherHistoryModel, req, res);
const addLayer2SubjectiveOtherHistory = (req, res) =>
  addLayer2Subjective(OtherHistoryModel, req, res);
const addLayer3SubjectiveOthers = (req, res) =>
  addLayer3Subjective(OtherHistoryModel, req, res);
const updateOtherHistoryById = (req, res) =>
  updateHistoryById(OtherHistoryModel, req, res);
const updateObjectiveLayerForOtherHistory = (req, res) =>
  updateObjectiveLayerForHistory(OtherHistoryModel, req, res);
const updateOtherHistoryByIdForLastLayer = (req, res) =>
  updateHistoryByIdForLastLayer(OtherHistoryModel, req, res);
const addOtherHistoryForPatient = (req, res) =>
  addHistoryForPatient(OtherHistoryModelForPatient, req, res);
const getOtherHistoryByPatientId = (req, res) =>
  getHistoryByPatientId(OtherHistoryModelForPatient, req, res);
const deleteOtherHistoryByIds = (req, res) =>
  deleteHistoryByIds(OtherHistoryModel, req, res);
const GetMostUsedOtherHistory = (req, res) =>
  GetMostUsedHistory(OtherHistoryModel, req, res);

const deleteObstetricHistoryFormHistory = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Deleting lifestyle history with ID:", id);

    const deletedRecord =
      await ObstetricHistoryModelForPatient.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    res.status(200).json({
      success: true,
      message: "Record deleted successfully",
      data: deletedRecord,
    });
  } catch (error) {
    console.error("Error deleting lifestyle history:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
const deleteObstetricHistoryObjectiveEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params;

    const lifestyle = await ObstetricHistoryModel.findById(id);

    console.log("deleteLifeStyleObjectiveEntriesByIndex", req.body);

    if (!lifestyle) {
      return res.status(404).json({ msg: "Lifestyle not found" });
    }

    const idsToDelete = req.body?.ids || [];
    console.log(idsToDelete);

    if (!Array.isArray(idsToDelete) || idsToDelete.length === 0) {
      return res
        .status(400)
        .json({ msg: "IDs array is required and must not be empty" });
    }

    idsToDelete.forEach((idToDelete) => {
      const index = lifestyle.objective.findIndex(
        (obj) => obj._id.toString() === idToDelete
      );
      if (index !== -1) {
        lifestyle.objective.splice(index, 1);
      }
    });

    lifestyle.markModified("objective");

    await lifestyle.save();

    res.status(200).json({
      msg: "Objective entries deleted successfully",
      updatedData: lifestyle,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting objective entries",
      details: err.message,
    });
  }
};
const deleteObstetricHistoryInnerObjectiveDataEntries = async (req, res) => {
  try {
    const { id } = req.params;
    const { objectiveId, innerObjectiveId, innerObjectiveDataId } =
      req.body.ids;

    console.log("deleteLifeStyleInnerObjectiveDataEntries", req.body);

    if (
      !objectiveId ||
      !innerObjectiveId ||
      !Array.isArray(innerObjectiveDataId) ||
      innerObjectiveDataId.length === 0
    ) {
      return res.status(400).json({
        msg: "Invalid request data: objectiveId, innerObjectiveId, and non-empty innerObjectiveDataId array are required",
        success: false,
      });
    }

    const lifestyle = await ObstetricHistoryModel.findById(id);
    if (!lifestyle) {
      return res
        .status(404)
        .json({ msg: "Lifestyle not found", success: false });
    }

    const objectiveItem = lifestyle.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!objectiveItem) {
      return res.status(400).json({
        msg: "Objective not found for the given objectiveId",
        success: false,
      });
    }

    const innerObjectiveItem = objectiveItem.objective.find(
      (obj) => obj._id.toString() === innerObjectiveId
    );
    if (!innerObjectiveItem) {
      return res.status(400).json({
        msg: "Inner objective not found for the given innerObjectiveId",
        success: false,
      });
    }

    if (
      !innerObjectiveItem.objective ||
      !Array.isArray(innerObjectiveItem.objective)
    ) {
      return res.status(400).json({
        msg: "Nested objective array not found in the inner objective",
        success: false,
      });
    }

    innerObjectiveDataId.forEach((idToDelete) => {
      const index = innerObjectiveItem.objective.findIndex(
        (data) => data._id.toString() === idToDelete
      );
      if (index !== -1) {
        innerObjectiveItem.objective.splice(index, 1);
      }
    });

    lifestyle.markModified("objective");
    await lifestyle.save();

    res.status(200).json({
      msg: "Inner objective data entries deleted successfully",
      updatedData: lifestyle,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting inner objective data entries",
      details: err.message,
      success: false,
    });
  }
};
const deleteObstetricHistoryObjectiveInnerDataEntriesByIndex = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { objectiveId, innerDataId } = req.body?.ids;
    console.log(req.body?.ids);
    if (
      !objectiveId ||
      !Array.isArray(innerDataId) ||
      innerDataId.length === 0
    ) {
      return res.status(400).json({
        msg: "Invalid request data: objectiveId and non-empty innerDataId array are required",
        success: false,
      });
    }

    const lifestyle = await ObstetricHistoryModel.findById(id);
    if (!lifestyle) {
      return res.status(404).json({ msg: "Lifestyle not found" });
    }

    const objectiveItem = lifestyle.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!objectiveItem) {
      return res.status(400).json({
        msg: "Objective not found for the given objectiveId",
        success: false,
      });
    }

    if (!objectiveItem.objective || !Array.isArray(objectiveItem.objective)) {
      return res.status(400).json({
        msg: "innerData array not found in the objective",
        success: false,
      });
    }

    innerDataId.forEach((idToDelete) => {
      const index = objectiveItem.objective.findIndex(
        (data) => data._id.toString() === idToDelete
      );
      if (index !== -1) {
        objectiveItem.objective.splice(index, 1);
      }
    });

    lifestyle.markModified("objective");
    await lifestyle.save();

    res.status(200).json({
      msg: "InnerData entries deleted successfully",
      updatedData: lifestyle,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting objective entries",
      details: err.message,
    });
  }
};

const editObstetricHistoryObjectiveInnerDataEntry = async (req, res) => {
  try {
    console.log("editLifeStyleObjectiveInnerDataEntry", req.body);
    const { id } = req.params;
    const { objectiveIndex, innerDataIndex, data } = req.body;

    if (
      typeof objectiveIndex !== "number" ||
      typeof innerDataIndex !== "number" ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid request data", success: false });
    }

    const lifestyle = await ObstetricHistoryModel.findById(id);
    if (!lifestyle) {
      return res.status(404).json({ msg: "Lifestyle not found" });
    }

    if (objectiveIndex < 0 || objectiveIndex >= lifestyle.objective.length) {
      return res.status(400).json({ msg: "Invalid objective index" });
    }

    const objectiveItem = lifestyle.objective[objectiveIndex];

    if (
      !objectiveItem.innerData ||
      innerDataIndex < 0 ||
      innerDataIndex >= objectiveItem.innerData.length
    ) {
      return res.status(400).json({ msg: "Invalid innerData index" });
    }

    objectiveItem.innerData[innerDataIndex].data = data;

    lifestyle.markModified("objective");

    await lifestyle.save();

    res.status(200).json({
      msg: "InnerData entry updated successfully",
      updatedData: lifestyle,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating innerData entry",
      details: err.message,
    });
  }
};
const updateObstetricHistoryObjectiveEntryByIndex = async (req, res) => {
  try {
    const { id } = req.params;
    const { problem, layer2id, layer3id, layer4id } = req.body;
    console.log("api called");
    console.log(id, layer2id, layer3id, layer4id);

    const lifestyle = await ObstetricHistoryModel.findById(id);

    if (!lifestyle) {
      return res.status(404).json({ msg: "Lifestyle not found" });
    }

    if (!problem) {
      return res.status(400).json({ msg: "Missing problem field" });
    }

    let targetObjective;

    if (!layer2id) {
      return res.status(400).json({ msg: "layer2id is required" });
    }

    targetObjective = lifestyle.objective.find(
      (obj) => obj._id.toString() === layer2id
    );
    if (!targetObjective) {
      return res
        .status(400)
        .json({ msg: "Objective not found for the given layer2id" });
    }

    if (layer2id && !layer3id && !layer4id) {
      targetObjective.problem = problem;
    } else if (layer2id && layer3id && !layer4id) {
      const nestedObjective = targetObjective.objective.find(
        (obj) => obj._id.toString() === layer3id
      );
      if (!nestedObjective) {
        return res
          .status(400)
          .json({ msg: "Specified nested objective not found" });
      }
      nestedObjective.problem = problem;
    } else if (layer2id && layer3id && layer4id) {
      const nestedObjective = targetObjective.objective.find(
        (obj) => obj._id.toString() === layer3id
      );
      if (!nestedObjective || !nestedObjective.objective) {
        return res
          .status(400)
          .json({ msg: "Nested objective array not found" });
      }

      const lastNestedObjective =
        nestedObjective.objective[nestedObjective.objective.length - 1];
      if (!lastNestedObjective) {
        return res.status(400).json({ msg: "Last nested objective not found" });
      }
      lastNestedObjective.problem = problem;
    } else {
      return res.status(400).json({ msg: "Invalid request parameters" });
    }

    lifestyle.markModified("objective");
    await lifestyle.save();

    res.status(200).json({
      msg: "Objective entry updated successfully",
      updatedData: lifestyle,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating objective entry",
      details: err.message,
    });
  }
};

const updateObjectiveObstetricHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { objective } = req.body;
    console.log("id", id, "objective", objective);
    const lifestyle = await ObstetricHistoryModel.findById(id);
    lifestyle?.innerData?.push(...innerData);
    const newLifeStyle = await lifestyle.save();
    res.status(httpStatus.CREATED).json({
      msg: "Lifestyle Updated Objective Successfully",
      data: newLifeStyle,
    });
  } catch (error) {
    console.error("Error storing Lifestyle Objective:", error);
    res.status(400).json({ error: error.message });
  }
};
const createObstetricHistory = async (req, res) => {
  try {
    const { problem, answerType, departmentId, consultantId, objective, note } =
      req.body;
    console.log("req.body", req.body);

    if (!problem || !answerType || !departmentId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "Missing required fields: problem, answerType, or departmentId",
      });
    }

    let finalObjective = [];
    let finalNote = "";

    if (answerType.toLowerCase() === "subjective") {
      finalNote = note || "";
    } else {
      finalObjective = Array.isArray(objective) ? objective : [];
    }

    const newLifeStyle = new ObstetricHistoryModel({
      problem,
      answerType,
      departmentId,
      consultantId,
      objective: finalObjective,
      note: finalNote,
    });

    const savedLifeStyle = await newLifeStyle.save();

    res.status(httpStatus.CREATED).json({
      msg: "Lifestyle Added Successfully",
      data: savedLifeStyle,
    });
  } catch (error) {
    console.error("Error storing Lifestyle:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong while storing lifestyle data.",
      error: error.message,
    });
  }
};

const getAllObstetricHistory = async (req, res) => {
  try {
    const lifeStyles = await ObstetricHistoryModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: lifeStyles });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateSubjectiveObstetricHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { answerType, objective, problem } = req.body;
    console.log(objective);

    if (!answerType || !problem) {
      return res.status(400).json({
        message: "Please send answerType and problem",
      });
    }

    const lifestyle = await ObstetricHistoryModel.findById(id);
    if (!lifestyle) {
      return res.status(404).json({
        message: "ObstetricHistory not found",
      });
    }

    lifestyle.answerType = answerType;
    lifestyle.problem = problem;
    lifestyle.objective =
      answerType.toLowerCase() === "objective" ? objective : [];
    lifestyle.notes = "";

    await lifestyle.save();

    return res.status(200).json({
      message: "Lifestyle updated successfully",
      lifestyle,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const addLayer2SubjectiveObstetricHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { objective, objectiveId } = req.body;
    console.log(objective, objectiveId);

    if (!objective || !objectiveId) {
      return res
        .status(400)
        .json({ message: "objective or objectiveId not found" });
    }

    const lifestyle = await ObstetricHistoryModel.findById(id);
    if (!lifestyle) {
      return res.status(404).json({ message: "Lifestyle not found" });
    }

    const target = lifestyle.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!target) {
      return res.status(404).json({ message: "Lifestyle objective not found" });
    }

    target.objective = objective;

    await lifestyle.save();

    return res.status(200).json({
      message: "Layer 2 objective added successfully",
      lifestyle,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const addLayer3SubjectiveObstetricHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { objective, objectiveId, subObjectiveId } = req.body;

    if (!objective) {
      return res.status(400).json({ message: "Objective data is required" });
    }

    const lifestyle = await ObstetricHistoryModel.findById(id);
    if (!lifestyle) {
      return res.status(404).json({ message: "Lifestyle not found" });
    }

    const layer1 = lifestyle.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!layer1) {
      return res.status(404).json({ message: "Layer 1 objective not found" });
    }

    const layer2 = layer1.objective.find(
      (obj) => obj._id.toString() === subObjectiveId
    );
    if (!layer2) {
      return res.status(404).json({ message: "Layer 2 objective not found" });
    }

    layer2.objective = objective;
    await lifestyle.save();
    return res.status(200).json({
      message: "Layer 3 objective added successfully",
      lifestyle,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const updateObstetricHistoryById = async (req, res) => {
  const { id } = req.params;
  const { objective } = req.body;
  const { layer2Data } = req.body;
  console.log(layer2Data);

  console.log("layer2Data");

  if (!objective && layer2Data) {
    try {
      const lifestyle = await ObstetricHistoryModel.findById(id);
      if (!lifestyle) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ msg: "Lifestyle not found" });
      }

      const target = lifestyle.objective.find(
        (obj) => obj._id.toString() === layer2Data.objective._id
      );

      if (!target) {
        return res
          .status(httpStatus.NOT_FOUND)
          .json({ msg: "Target objective not found in lifestyle.objective" });
      }

      const newChildren = layer2Data.objective.objective;
      if (!Array.isArray(newChildren)) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ msg: "layer2Data.objective.objective must be an array" });
      }

      newChildren.forEach((child) => {
        if (child.problem && child.answerType) {
          target.objective.push({
            problem: child.problem,
            answerType: child.answerType,
            objective: Array.isArray(child.objective) ? child.objective : [],
          });
        }
      });

      const updated = await lifestyle.save();

      return res.status(httpStatus.OK).json({
        msg: "Child objectives added to target objective",
        data: updated,
      });
    } catch (error) {
      console.error("Error updating lifestyle:", error);
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        msg: "Internal server error",
        error: error.message,
      });
    }
  }

  console.log("objective---", objective);
  try {
    const lifestyle = await ObstetricHistoryModel.findById(id);
    if (!lifestyle) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Lifestyle not found" });
    }

    if (!Array.isArray(objective) || objective.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "",
      });
    }

    objective.forEach((obj) => {
      if (obj.problem && obj.answerType) {
        lifestyle.objective.push({
          problem: obj.problem,
          answerType: obj.answerType,
          objective: Array.isArray(obj.objective) ? obj.objective : [],
        });
      }
    });

    const updatedLifestyle = await lifestyle.save();

    return res.status(httpStatus.OK).json({
      msg: "Objectives added to first layer",
      data: updatedLifestyle,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};
const updateObjectiveLayerObstetricHistory = async (req, res) => {
  try {
    const { addlayer } = req.body;
    const { id } = req.params;

    console.log("addlayer", addlayer);
    console.log("req.body", req.body);

    const mainDoc = await ObstetricHistoryModel.findById(id);
    if (!mainDoc) {
      return res.status(404).json({ message: "Main document not found" });
    }

    if (addlayer === 1) {
      console.log("Layer 1");

      mainDoc.objective.push(...req.body.objective);

      await mainDoc.save();

      return res.status(200).json({
        message: "Objectives added successfully",
        addlayer,
        updated: mainDoc,
      });
    } else if (addlayer === 2) {
      console.log("Layer 1");

      const targetId = new mongoose.Types.ObjectId(req.body.objective._id);

      const targetObj = mainDoc.objective.find(
        (obj) => obj._id.toString() === targetId.toString()
      );

      if (!targetObj) {
        return res.status(404).json({ message: "Layer 1 objective not found" });
      }

      targetObj.objective.push(...req.body.objective.objective);

      await mainDoc.save();

      const lastInserted = targetObj.objective[targetObj.objective.length - 1];

      return res.status(200).json({
        message: "Objectives added successfully",
        addlayer,
        updated: lastInserted,
      });
    } else if (addlayer === 3) {
      console.log("Layer 3");

      const layer1Id = req.body.objective._id;
      const layer2Id = req.body.objective.objective._id;
      const newObjectives = req.body.objective.objective.objective;

      const targetLevel1 = mainDoc.objective.find(
        (obj) => obj._id.toString() === layer1Id
      );
      if (!targetLevel1) {
        return res.status(404).json({ message: "Layer 1 objective not found" });
      }

      const targetLevel2 = targetLevel1.objective.find(
        (obj) => obj._id.toString() === layer2Id
      );
      if (!targetLevel2) {
        return res.status(404).json({ message: "Layer 2 objective not found" });
      }

      targetLevel2.objective.push(...newObjectives);

      await mainDoc.save();

      const lastInserted =
        targetLevel2.objective[targetLevel2.objective.length - 1];

      return res.status(200).json({
        message: "Objectives added to Layer 3",
        addlayer,
        updated: lastInserted,
      });
    }

    await mainDoc.save();
    return res
      .status(200)
      .json({ message: "Objective added successfully", data: mainDoc });
  } catch (err) {
    console.error("Error adding objective:", err);
    return res.status(500).json({ message: err.message });
  }
};

const updateObstetricHistoryByIdForLastLayer = async (req, res) => {
  const { id } = req.params;
  const { objective, _id } = req.body;

  console.log("objectives", objective);

  try {
    if (!objective || !Array.isArray(objective.objective)) {
      return res.status(400).json({ msg: "Invalid or missing objective data" });
    }

    const updatedLifeStyle = await ObstetricHistoryModel.findOneAndUpdate(
      {
        _id: id,
        "objective._id": _id,
        "objective.objective._id": objective._id,
      },
      {
        $push: {
          "objective.$.objective.$[obj].objective": {
            $each: objective.objective.map((newObj) => ({
              problem: newObj.problem,
              answerType: newObj.answerType,
              objective: Array.isArray(newObj.objective)
                ? newObj.objective
                : [],
            })),
          },
        },
      },
      {
        new: true,
        arrayFilters: [{ "obj._id": objective._id }],
      }
    );

    if (!updatedLifeStyle) {
      return res
        .status(404)
        .json({ msg: "Objective with specified _id not found" });
    }

    return res.status(200).json({
      msg: "Objectives added successfully",
      data: updatedLifeStyle,
    });
  } catch (error) {
    console.error("❌ Error updating lifeStyle:", error);
    return res.status(500).json({
      msg: "Internal server error",
      error: error.message,
    });
  }
};
const addObstetricHistoryHistory = async (req, res) => {
  try {
    const { openData, userId, patientId } = req.body;
    console.log("addPersnalHistory", JSON.stringify(req.body));

    if (!openData || !openData.problem || !openData.answerType) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newEntry = new ObstetricHistoryModelForPatient({
      consultantId: userId,
      PatientId: patientId,
      answerType: openData.answerType,
      problem: openData.problem,
      objective: openData.objective,
    });

    await newEntry.save();

    res.status(201).json({
      message: "Lifestyle history ffffsaved successfully",
      data: newEntry,
    });
  } catch (error) {
    console.error("❌ Error saving lifestyle history:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetObstetricHistorybypatientId = (req, res) =>
  getHistoryByPatientId(ObstetricHistoryModelForPatient, req, res);
const addObstetricHistoryHistoryByPatientId = (req, res) =>
  addHistoryForPatient(ObstetricHistoryModelForPatient, req, res);

const deleteObstetricHistoryByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await ObstetricHistoryModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Lifestyle found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Lifestyle deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting Lifestyle",
      details: err.message,
    });
  }
};

const GetMostUsedObstetricHistory = async (req, res) => {
  try {
    const adminId =
      req.query.adminId || req.body?.adminId || req.params.adminId;
    const { id } = req.params;
    let query = { delete: false };
    if (adminId) {
      query.adminId = adminId;
    } else {
      query.departmentId = id;
    }
    const lifeStyles = await ObstetricHistoryModel.find(query)
      .sort({ createdAt: -1 })
      .limit(15);
    res.status(httpStatus.OK).json({ data: lifeStyles });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteNutritionalHistoryFormHistory = (req, res) =>
  deleteHistoryFormHistory(NutritionalHistoryModelForPatient, req, res);
const deleteNutritionalObjectiveEntriesByIndex = (req, res) =>
  deleteObjectiveEntriesByIndex(NutritionalHistoryModel, req, res);
const deleteNutritionalInnerObjectiveDataEntries = (req, res) =>
  deleteInnerObjectiveDataEntries(NutritionalHistoryModel, req, res);
const deleteNutritionalObjectiveInnerDataEntriesByIndex = (req, res) =>
  deleteObjectiveInnerDataEntriesByIndex(NutritionalHistoryModel, req, res);
const editNutritionalObjectiveInnerDataEntry = (req, res) =>
  editObjectiveInnerDataEntry(NutritionalHistoryModel, req, res);
const updateNutritionalObjectiveEntryByIndex = (req, res) =>
  updateObjectiveEntryByIndex(NutritionalHistoryModel, req, res);
const updateObjectiveNutritional = (req, res) =>
  updateObjective(NutritionalHistoryModel, req, res);
const createNutritionalHistory = (req, res) =>
  createHistory(NutritionalHistoryModel, req, res);
const getAllNutritionalHistory = (req, res) =>
  getAllHistory(NutritionalHistoryModel, req, res);
const updateSubjectiveNutritionalHistoryById = (req, res) =>
  updateSubjectiveById(NutritionalHistoryModel, req, res);
const addLayer2SubjectiveNutritionalHistory = (req, res) =>
  addLayer2Subjective(NutritionalHistoryModel, req, res);
const addLayer3SubjectiveNutritional = (req, res) =>
  addLayer3Subjective(NutritionalHistoryModel, req, res);
const updateNutritionalHistoryById = (req, res) =>
  updateHistoryById(NutritionalHistoryModel, req, res);
const updateObjectiveLayerForNutritionalHistory = (req, res) =>
  updateObjectiveLayerForHistory(NutritionalHistoryModel, req, res);
const updateNutritionalHistoryByIdForLastLayer = (req, res) =>
  updateHistoryByIdForLastLayer(NutritionalHistoryModel, req, res);
const addNutritionalHistoryForPatient = (req, res) =>
  addHistoryForPatient(NutritionalHistoryModelForPatient, req, res);
const getNutritionalHistoryByPatientId = (req, res) =>
  getHistoryByPatientId(NutritionalHistoryModelForPatient, req, res);
const deleteNutritionalHistoryByIds = (req, res) =>
  deleteHistoryByIds(NutritionalHistoryModel, req, res);
const GetMostUsedNutritionalHistory = (req, res) =>
  GetMostUsedHistory(NutritionalHistoryModel, req, res);

const deletePediatricHistoryFormHistory = (req, res) =>
  deleteHistoryFormHistory(PediatricHistoryModelForPatient, req, res);
const deletePediatricObjectiveEntriesByIndex = (req, res) =>
  deleteObjectiveEntriesByIndex(PediatricHistoryModel, req, res);
const deletePediatricInnerObjectiveDataEntries = (req, res) =>
  deleteInnerObjectiveDataEntries(PediatricHistoryModel, req, res);
const deletePediatricObjectiveInnerDataEntriesByIndex = (req, res) =>
  deleteObjectiveInnerDataEntriesByIndex(PediatricHistoryModel, req, res);
const editPediatricObjectiveInnerDataEntry = (req, res) =>
  editObjectiveInnerDataEntry(PediatricHistoryModel, req, res);
const updatePediatricObjectiveEntryByIndex = (req, res) =>
  updateObjectiveEntryByIndex(PediatricHistoryModel, req, res);
const updateObjectivePediatric = (req, res) =>
  updateObjective(PediatricHistoryModel, req, res);
const createPediatricHistory = (req, res) =>
  createHistory(PediatricHistoryModel, req, res);
const getAllPediatricHistory = (req, res) =>
  getAllHistory(PediatricHistoryModel, req, res);
const updateSubjectivePediatricHistoryById = (req, res) =>
  updateSubjectiveById(PediatricHistoryModel, req, res);
const addLayer2SubjectivePediatricHistory = (req, res) =>
  addLayer2Subjective(PediatricHistoryModel, req, res);
const addLayer3SubjectivePediatric = (req, res) =>
  addLayer3Subjective(PediatricHistoryModel, req, res);
const updatePediatricHistoryById = (req, res) =>
  updateHistoryById(PediatricHistoryModel, req, res);
const updateObjectiveLayerForPediatricHistory = (req, res) =>
  updateObjectiveLayerForHistory(PediatricHistoryModel, req, res);
const updatePediatricHistoryByIdForLastLayer = (req, res) =>
  updateHistoryByIdForLastLayer(PediatricHistoryModel, req, res);
const addPediatricHistoryForPatient = (req, res) =>
  addHistoryForPatient(PediatricHistoryModelForPatient, req, res);
const getPediatricHistoryByPatientId = (req, res) =>
  getHistoryByPatientId(PediatricHistoryModelForPatient, req, res);
const deletePediatricHistoryByIds = (req, res) =>
  deleteHistoryByIds(PediatricHistoryModel, req, res);
const GetMostUsedPediatricHistory = (req, res) =>
  GetMostUsedHistory(PediatricHistoryModel, req, res);

const createProcedure = async (req, res) => {
  try {
    const newProcedure = new ProcedureModel({ ...req.body });
    const savedProcedure = await newProcedure.save();
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Procedure Added Successfully ", data: savedProcedure });
  } catch (error) {
    console.error("Error storing Procedure:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllProcedure = async (req, res) => {
  try {
    const procedure = await ProcedureModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: procedure });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateProcedureById = async (req, res) => {
  try {
    const Procedure = await ProcedureModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res
      .status(httpStatus.OK)
      .json({ msg: "Procedure  Updated Successfully", Procedure });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Procedure Not Found", error });
  }
};

const deleteProcedureByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await ProcedureModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Procedure found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Procedure deleted successfully", result });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in deleting Procedure", details: err.message });
  }
};

const GetMostUsedProcedure = async (req, res) => {
  try {
    const adminId =
      req.query.adminId || req.body?.adminId || req.params.adminId;
    const { id } = req.params;
    let query = { delete: false };
    if (adminId) {
      query.adminId = adminId;
    } else {
      query.departmentId = id;
    }
    const procedure = await ProcedureModel.find(query)
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(httpStatus.OK).json({ data: procedure });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const createInstruction = async (req, res) => {
  try {
    const newInstruction = new InstructionModel({ ...req.body });
    const savedInstruction = await newInstruction.save();
    res.status(httpStatus.CREATED).json({
      msg: "Instruction Data Added Successfully ",
      data: savedInstruction,
    });
  } catch (error) {
    console.error("Error storing Instruction Data:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllInstruction = async (req, res) => {
  try {
    const instruction = await InstructionModel.find({ delete: false });

    res.status(httpStatus.OK).json({ data: instruction });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateInstructionById = async (req, res) => {
  try {
    const Instruction = await InstructionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res
      .status(httpStatus.OK)
      .json({ msg: "Instruction  Updated Successfully", Instruction });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Instruction Not Found", error });
  }
};

const deleteInstructionByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await InstructionModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Instruction found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Instruction deleted successfully", result });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in deleting Instruction", details: err.message });
  }
};

const GetMostInstruction = async (req, res) => {
  try {
    const { id } = req.params;
    const instruction = await InstructionModel.find({
      delete: false,
      departmentId: id,
    })
      .sort({ count: -1 })
      .limit(30);

    res.status(httpStatus.OK).json({ data: instruction });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const createAdvice = async (req, res) => {
  try {
    const newAdvice = new AdviceModel({ ...req.body });
    const savedAdvice = await newAdvice.save();
    res.status(httpStatus.CREATED).json({
      msg: "Advice Data Added Successfully ",
      data: savedAdvice,
    });
  } catch (error) {
    console.error("Error storing Advice Data:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllAdvice = async (req, res) => {
  try {
    const advice = await AdviceModel.find({ delete: false });

    res.status(httpStatus.OK).json({ data: advice });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const editAdvice = async (req, res) => {
  try {
    const { id } = req.params;
    const { advice, departmentId } = req.body;

    if (!advice || !departmentId) {
      return res
        .status(400)
        .json({ message: "Advice and departmentId are required" });
    }

    const updatedAdvice = await AdviceModel.findByIdAndUpdate(
      id,
      { advice: advice.trim(), departmentId },
      { new: true }
    );

    if (!updatedAdvice) {
      return res.status(404).json({ message: "Advice not found" });
    }

    res
      .status(200)
      .json({ message: "Advice updated successfully", data: updatedAdvice });
  } catch (error) {
    console.error("Error editing advice:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteAdvice = async (req, res) => {
  console.log("working properly delete");
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No advice IDs provided" });
    }

    const result = await AdviceModel.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          delete: true,
          deletedAt: new Date(),
        },
      }
    );

    res.status(200).json({
      message: `${result.modifiedCount} advice record(s) deleted`,
    });
  } catch (error) {
    console.error("Error deleting advice:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createChiefComplaint = async (req, res) => {
  try {
    const newChiefComplaint = new ChiefComplaintModel({ ...req.body });
    const savedChiefComplaint = await newChiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Chief Complaint Added Successfully ",
      data: savedChiefComplaint,
    });
  } catch (error) {
    console.error("Error storing Chief Complaint:", error);
    res.status(400).json({ error: error.message });
  }
};
const createPainChiefComplaint = async (req, res) => {
  try {
    const newChiefComplaint = new PainChiefComplaintModel({ ...req.body });
    const savedChiefComplaint = await newChiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Pain Chief Complaint Added SuccessFully ",
      data: savedChiefComplaint,
    });
  } catch (error) {
    console.error("Error storing Chief Complaint:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllChiefComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const ChiefComplaint = await ChiefComplaintModel.find({
      departmentId: new mongoose.Types.ObjectId(id),
      delete: false,
    });
    res.status(httpStatus.OK).json({ data: ChiefComplaint });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};
const getAllPainChiefComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const ChiefComplaint = await PainChiefComplaintModel.find({
      departmentId: new mongoose.Types.ObjectId(id),
      delete: false,
    });
    res.status(httpStatus.OK).json({ data: ChiefComplaint });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const { symptoms } = req.body;
    const chiefComplaint = await ChiefComplaintModel.findById(id);
    chiefComplaint.symptoms.push(...symptoms);
    const newchiefComplaint = await chiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Chief Complaint Updated Successfully ",
      data: newchiefComplaint,
    });
  } catch (error) {
    console.error("Error storing Chief Complaint:", error);
    res.status(400).json({ error: error.message });
  }
};

const updateDescriptionCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const chiefComplaint = await ChiefComplaintModel.findById(id);
    chiefComplaint.description.push(...description);
    const newchiefComplaint = await chiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Chief Complaint Desscription Updated Successfully ",
      data: newchiefComplaint,
    });
  } catch (error) {
    console.error("Error Updating Chief Complaint Description:", error);
    res.status(400).json({ error: error.message });
  }
};

const updatePainChiefComplaintAll = async (req, res) => {
  const { id } = req.params;
  const {
    Location = [],
    natureOfPain = [],
    duration = [],
    aggravatingFactors = [],
    relievingFactors = [],
    quality = [],
    chiefComplaint = "",
  } = req.body;

  try {
    const updatedComplaint = await PainChiefComplaintModel.findByIdAndUpdate(
      id,
      {
        $set: {
          location: Location,
          natureOfPain,
          duration,
          aggravatingFactors,
          relievingFactors,
          quality,
          chiefComplaint,
        },
      },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Chief complaint not found" });
    }

    return res.status(200).json({
      message: "Chief complaint updated successfully",
      data: updatedComplaint,
    });
  } catch (error) {
    console.error("Error updating Chief Complaint:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateRelevingFactors = async (req, res) => {
  try {
    const { id } = req.params;
    const { relievingFactors } = req.body;
    const chiefComplaint = await PainChiefComplaintModel.findById(id);
    chiefComplaint.relievingFactors.push(...relievingFactors);
    const newchiefComplaint = await chiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Chief Complaint relievingFactors Updated Successfully ",
      data: newchiefComplaint,
    });
  } catch (error) {
    console.error("Error Updating Chief Complaint Description:", error);
    res.status(400).json({ error: error.message });
  }
};

const updateSinceCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { since } = req.body;
    const chiefComplaint = await ChiefComplaintModel.findById(id);
    chiefComplaint.since.push(...since);
    const newchiefComplaint = await chiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Chief Complaint Since Updated Successfully ",
      data: newchiefComplaint,
    });
  } catch (error) {
    console.error("Error Updating Chief Complaint Since:", error);
    res.status(400).json({ error: error.message });
  }
};
const updatePainDuration = async (req, res) => {
  try {
    const { id } = req.params;
    const { duration } = req.body;
    const chiefComplaint = await PainChiefComplaintModel.findById(id);
    chiefComplaint.duration.push(...duration);
    const newchiefComplaint = await chiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Chief Complaint duration Updated Successfully ",
      data: newchiefComplaint,
    });
  } catch (error) {
    console.error("Error Updating Chief Complaint duration:", error);
    res.status(400).json({ error: error.message });
  }
};

const updateTreatmentCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { treatment } = req.body;
    const chiefComplaint = await ChiefComplaintModel.findById(id);
    chiefComplaint.treatment.push(...treatment);
    const newchiefComplaint = await chiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Chief Complaint Treatment Updated Successfully ",
      data: newchiefComplaint,
    });
  } catch (error) {
    console.error("Error Updating Chief Complaint Treatment:", error);
    res.status(400).json({ error: error.message });
  }
};

const updateLocationCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { Location } = req.body;
    const chiefComplaint = await ChiefComplaintModel.findById(id);
    chiefComplaint.Location.push(...Location);
    const newchiefComplaint = await chiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Chief Complaint Location Updated Successfully ",
      data: newchiefComplaint,
    });
  } catch (error) {
    console.error("Error Updating Chief Complaint Location:", error);
    res.status(400).json({ error: error.message });
  }
};
const updatePainLocationCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { Location } = req.body;
    const chiefComplaint = await PainChiefComplaintModel.findById(id);
    chiefComplaint.location.push(...Location);
    const newchiefComplaint = await chiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Chief Complaint Location Updated Successfully ",
      data: newchiefComplaint,
    });
  } catch (error) {
    console.error("Error Updating Chief Complaint Location:", error);
    res.status(400).json({ error: error.message });
  }
};
const updateQualityPain = async (req, res) => {
  try {
    const { id } = req.params;
    const { quality } = req.body;
    const chiefComplaint = await PainChiefComplaintModel.findById(id);
    chiefComplaint.quality.push(...quality);
    const newchiefComplaint = await chiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Chief Complaint quality Updated Successfully ",
      data: newchiefComplaint,
    });
  } catch (error) {
    console.error("Error Updating Chief Complaint Location:", error);
    res.status(400).json({ error: error.message });
  }
};
const updateNatureOfPain = async (req, res) => {
  try {
    const { id } = req.params;
    const { natureOfPain } = req.body;
    const chiefComplaint = await PainChiefComplaintModel.findById(id);
    chiefComplaint.natureOfPain.push(...natureOfPain);
    const newchiefComplaint = await chiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Chief Complaint quality Updated Successfully ",
      data: newchiefComplaint,
    });
  } catch (error) {
    console.error("Error Updating Chief Complaint Location:", error);
    res.status(400).json({ error: error.message });
  }
};
const updateAggregatingFactors = async (req, res) => {
  try {
    const { id } = req.params;
    const { aggravatingFactors } = req.body;
    const chiefComplaint = await PainChiefComplaintModel.findById(id);
    chiefComplaint.aggravatingFactors.push(...aggravatingFactors);
    const newchiefComplaint = await chiefComplaint.save();
    res.status(httpStatus.CREATED).json({
      msg: "Chief Complaint aggravatingFactors Updated Successfully ",
      data: newchiefComplaint,
    });
  } catch (error) {
    console.error("Error Updating Chief Complaint Location:", error);
    res.status(400).json({ error: error.message });
  }
};

const GetMostCheifcomplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const ChiefComplaint = await ChiefComplaintModel.find({
      delete: false,
      departmentId: id,
    })
      .sort({ count: -1 })
      .limit(30);
    res.status(httpStatus.OK).json({ data: ChiefComplaint });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateCheifcomplaintById = async (req, res) => {
  try {
    const { patientId } = req.body;
    console.log(patientId);

    const updatedChiefComplaint = await ChiefComplaintModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedChiefComplaint) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Chief Complaint Not Found" });
    }

    return res.status(httpStatus.OK).json({
      msg: "Chief Complaint Updated Successfully",
      data: updatedChiefComplaint,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error", error });
  }
};

const deleteCheifcomplaintByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => new mongoose.Types.ObjectId(id));

    const [chiefResult, painResult] = await Promise.allSettled([
      ChiefComplaintModel.deleteMany({ _id: { $in: objectIdArray } }),
      PainChiefComplaintModel.deleteMany({ _id: { $in: objectIdArray } }),
    ]);

    const response = {
      success: true,
      msg: "Deletion attempted in both collections.",
      deleted: {},
      errors: [],
    };

    if (chiefResult.status === "fulfilled") {
      response.deleted.chiefComplaints = chiefResult.value.deletedCount;
    } else {
      response.errors.push({
        model: "ChiefComplaintModel",
        error: chiefResult.reason.message,
      });
    }

    if (painResult.status === "fulfilled") {
      response.deleted.painChiefComplaints = painResult.value.deletedCount;
    } else {
      response.errors.push({
        model: "PainChiefComplaintModel",
        error: painResult.reason.message,
      });
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error("Unexpected error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Unexpected server error",
      details: err.message,
    });
  }
};

const deletePainChiefComplaintById = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => mongoose.Types.ObjectId(id));

    const result = await PainChiefComplaintModel.deleteMany({
      _id: { $in: objectIdArray },
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ msg: "No Chief Complaint found with the provided IDs" });
    }

    res
      .status(200)
      .json({ msg: "Chief Complaint deleted successfully", result });
  } catch (err) {
    console.error("Error deleting Chief Complaint:", err.message);
    res.status(500).json({
      error: "Error in deleting Chief Complaint",
      details: err.message,
    });
  }
};

const deleteSingleChiefComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "ID is required" });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const result = await ChiefComplaintModel.findByIdAndDelete(objectId);

    if (!result) {
      return res.status(404).json({ msg: "Chief Complaint not found" });
    }

    res
      .status(200)
      .json({ msg: "Chief Complaint deleted successfully", result });
  } catch (err) {
    console.error("Error deleting Chief Complaint:", err.message);
    res.status(500).json({
      error: "Error in deleting Chief Complaint",
      details: err.message,
    });
  }
};
const deleteSinglePainChiefComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "ID is required" });
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const result = await PainChiefComplaintModel.findByIdAndDelete(objectId);

    if (!result) {
      return res.status(404).json({ msg: "Chief Complaint not found" });
    }

    res
      .status(200)
      .json({ msg: "Chief Complaint deleted successfully", result });
  } catch (err) {
    console.error("Error deleting Chief Complaint:", err.message);
    res.status(500).json({
      error: "Error in deleting Chief Complaint",
      details: err.message,
    });
  }
};

const createPresentIllnessHistory = async (req, res) => {
  try {
    const newPresentIllnessHistory = new PresentIllnessHistoryModel({
      ...req.body,
    });
    const savedPresentIllnessHistory = await newPresentIllnessHistory.save();
    res.status(httpStatus.CREATED).json({
      msg: "Present Illness HistoryModel Added Successfully ",
      data: savedPresentIllnessHistory,
    });
  } catch (error) {
    console.error("Error storing Present Illness HistoryModel:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllPresentIllnessHistory = async (req, res) => {
  try {
    const PresentIllnessHistory = await PresentIllnessHistoryModel.find({
      delete: false,
    });
    res.status(httpStatus.OK).json({ data: PresentIllnessHistory });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateObjectivePresentIllnessHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { objective } = req.body;
    const PresentIllnessHistory = await PresentIllnessHistoryModel.findById(id);
    PresentIllnessHistory.objective.push(...objective);
    const newcPresentIllnessHistory = await PresentIllnessHistory.save();
    res.status(httpStatus.CREATED).json({
      msg: "Present Illness History Updated Objective Successfully ",
      data: newcPresentIllnessHistory,
    });
  } catch (error) {
    console.error("Error storing Present Illness History Objective:", error);
    res.status(400).json({ error: error.message });
  }
};

const updatePresentIllnessHistory = async (req, res) => {
  try {
    const presentIllness = await PresentIllnessHistoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!presentIllness) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "Present Illness History Not Found" });
    }
    return res.status(httpStatus.OK).json({
      msg: "Present Illness History Updated Successfully",
      presentIllness,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Present Illness History Not Found", error });
  }
};

const deletePresentIllnessHistoryByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await PresentIllnessHistoryModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        msg: "No Present Illness History found with the provided IDs",
      });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Present Illness History deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting Present Illness History",
      details: err.message,
    });
  }
};

const GetMostPresentIllnessHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const PresentIllnessHistory = await PresentIllnessHistoryModel.find({
      delete: false,
      departmentId: id,
    })
      .sort({ count: -1 })
      .limit(30);
    res.status(httpStatus.OK).json({ data: PresentIllnessHistory });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const createProvisionalDiagnosis = async (req, res) => {
  try {
    const newProvisionalDiagnosis = new ProvisionalDiagnosisModel({
      ...req.body,
    });
    const savedProvisionalDiagnosis = await newProvisionalDiagnosis.save();
    res.status(httpStatus.CREATED).json({
      msg: "Provisional Diagnosis Added Successfully ",
      data: savedProvisionalDiagnosis,
    });
  } catch (error) {
    console.error("Error storing Provisional Diagnosis:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllProvisionalDiagnosis = async (req, res) => {
  try {
    const ProvisionalDiagnosis = await ProvisionalDiagnosisModel.find({
      delete: false,
    });
    res.status(httpStatus.OK).json({ data: ProvisionalDiagnosis });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateProvisionalDiagnosisById = async (req, res) => {
  try {
    const ProvisionalDiagnosis =
      await ProvisionalDiagnosisModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
    return res.status(httpStatus.OK).json({
      msg: "Provisional Diagnosis  Updated Successfully",
      ProvisionalDiagnosis,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Provisional Diagnosis Not Found", error });
  }
};

const deleteProvisionalDiagnosisByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await ProvisionalDiagnosisModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Provisional Diagnosis found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Provisional Diagnosis deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting Provisional Diagnosis",
      details: err.message,
    });
  }
};

const GetMostProvisionalDiagnosis = async (req, res) => {
  try {
    const ProvisionalDiagnosis = await ProvisionalDiagnosisModel.find({
      delete: false,
    })
      .sort({ count: -1 })
      .limit(30);
    res.status(httpStatus.OK).json({ data: ProvisionalDiagnosis });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const importJson = async (req, res) => {
  try {
    const diagnosis = req.body.diagnosis;
    const newdiagnosis = diagnosis.map(
      (diagnosis) => new ProvisionalDiagnosisModel(diagnosis)
    );

    await ProvisionalDiagnosisModel.insertMany(newdiagnosis);

    res
      .status(httpStatus.OK)
      .json({ msg: "diagnosis imported successfully", newdiagnosis });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Error in importing medicines", details: error.message });
  }
};

const createFinalDiagnosis = async (req, res) => {
  try {
    const newFinalDiagnosis = new FinalDiagnosisModel({
      ...req.body,
    });
    const savedFinalDiagnosis = await newFinalDiagnosis.save();
    res.status(httpStatus.CREATED).json({
      msg: "Final Diagnosis Added Successfully ",
      data: savedFinalDiagnosis,
    });
  } catch (error) {
    console.error("Error storing Final Diagnosis:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllFinalDiagnosis = async (req, res) => {
  try {
    const FinalDiagnosis = await FinalDiagnosisModel.find({
      delete: false,
    });
    res.status(httpStatus.OK).json({ data: FinalDiagnosis });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateFinalDiagnosisById = async (req, res) => {
  try {
    const FinalDiagnosis = await FinalDiagnosisModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res
      .status(httpStatus.OK)
      .json({ msg: "Final Diagnosis  Updated Successfully", FinalDiagnosis });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Final Diagnosis Not Found", error });
  }
};

const deleteFinalDiagnosisByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await FinalDiagnosisModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Final Diagnosis found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Final Diagnosis deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting Final Diagnosis",
      details: err.message,
    });
  }
};

const GetMostFinalDiagnosis = async (req, res) => {
  try {
    const { id } = req.params;
    const FinalDiagnosis = await FinalDiagnosisModel.find({
      delete: false,
      departmentId: id,
    })
      .sort({ count: -1 })
      .limit(30);
    res.status(httpStatus.OK).json({ data: FinalDiagnosis });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const createRiskFactor = async (req, res) => {
  try {
    const newRiskFactor = new RiskFactorModel({ ...req.body });
    const savedRiskFactor = await newRiskFactor.save();
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Risk Factor Added Successfully ", data: savedRiskFactor });
  } catch (error) {
    console.error("Error storing Risk Factor:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllRiskFactor = async (req, res) => {
  try {
    const RiskFactor = await RiskFactorModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: RiskFactor });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const GetMostRiskFactor = async (req, res) => {
  try {
    const { id } = req.params;
    const RiskFactor = await RiskFactorModel.find({
      delete: false,
      departmentId: id,
    })
      .sort({ count: -1 })
      .limit(20);
    res.status(httpStatus.OK).json({ data: RiskFactor });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getOpdMenu = async (req, res) => {
  try {
    const userId = req.user.adminId;
    const existingAdmin = await AdminModel.findOne({ _id: userId });
    const refId = existingAdmin.refId.toString();
    const newOpdMenu = await OPDMenuModel.find({
      consultantId: refId,
      delete: false,
    });
    res.status(httpStatus.OK).json({ data: newOpdMenu });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updatedOPDMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { menu, printMenu } = req.body;
    const newOpdMenu = await OPDMenuModel.findOneAndUpdate(
      { consultantId: id },
      { $set: { menu: menu, printMenu: printMenu } },
      { new: true }
    );
    res
      .status(httpStatus.OK)
      .json({ msg: "OPD Menu Updated.", data: newOpdMenu });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const createLocalExamination = async (req, res) => {
  try {
    const newLocalExamination = new LocalExaminationModel({ ...req.body });
    const savedLocalExamination = await newLocalExamination.save();
    res.status(httpStatus.CREATED).json({
      msg: "Local Examination Added Successfully ",
      data: savedLocalExamination,
    });
  } catch (error) {
    console.error("Error storing Risk Factor:", error);
    res.status(400).json({ error: error.message });
  }
};
const updateDiagramInLocalExamination = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagram } = req.body;

    if (!diagram) {
      return res.status(400).json({ error: "Diagram data is required" });
    }

    const updateLocalDiagram = await LocalExaminationModel.findByIdAndUpdate(
      id,
      { $set: { "exam.diagram": diagram } },
      { new: true }
    );

    if (!updateLocalDiagram) {
      return res.status(404).json({ error: "Local Examination not found" });
    }

    res.status(200).json({
      msg: "Diagram Updated Successfully",
      data: updateLocalDiagram,
    });
  } catch (error) {
    console.error("Error updating diagram:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateDiagramInLocalExaminationDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const updateLocalDiagram = await LocalExaminationModel.findByIdAndUpdate(
      id,
      { $set: { "exam.diagram": "" } },
      { new: true }
    );

    if (!updateLocalDiagram) {
      return res.status(404).json({ error: "Local Examination not found" });
    }

    res.status(200).json({
      msg: "Diagram Updated Successfully",
      data: updateLocalDiagram,
    });
  } catch (error) {
    console.error("Error updating diagram:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllLocalExamination = async (req, res) => {
  try {
    const LocalExamination = await LocalExaminationModel.find({
      delete: false,
    });
    res.status(httpStatus.OK).json({ data: LocalExamination });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const addNestedObjectiveForLocal = async (req, res) => {
  try {
    const { id } = req.params;
    const { subDisorderId, objectiveId, newObjective } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }
    if (!subDisorderId || typeof subDisorderId !== "string") {
      return res
        .status(400)
        .json({ error: "subDisorderId must be a non-empty string" });
    }
    if (!objectiveId || typeof objectiveId !== "string") {
      return res
        .status(400)
        .json({ error: "objectiveId must be a non-empty string" });
    }
    if (!newObjective || typeof newObjective !== "object") {
      return res.status(400).json({ error: "newObjective must be an object" });
    }

    const expectedFields = ["name", "answerType", "objective"];
    const hasAllFields = expectedFields.every((field) => field in newObjective);
    if (!hasAllFields) {
      return res.status(400).json({
        error: "newObjective must have name, answerType, and objective fields",
      });
    }
    if (
      typeof newObjective.name !== "string" ||
      typeof newObjective.answerType !== "string"
    ) {
      return res.status(400).json({
        error:
          "Invalid types in newObjective: name (string), answerType (string)",
      });
    }

    const LocalExamination = await LocalExaminationModel.findById(id);
    if (!LocalExamination) {
      return res.status(404).json({ error: "Local Examination not found" });
    }

    const targetSubDisorder = LocalExamination.exam.subDisorder.find(
      (subDisorder) => subDisorder._id.toString() === subDisorderId
    );
    if (!targetSubDisorder) {
      return res.status(404).json({
        error: "SubDisorder not found with the provided subDisorderId",
      });
    }

    const targetObjective = targetSubDisorder.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!targetObjective) {
      return res.status(404).json({
        error: "Objective item not found with the provided objectiveId",
      });
    }

    targetObjective.objective.push(newObjective);

    const updatedLocalExamination = await LocalExamination.save();

    res.status(httpStatus.OK).json({
      msg: "Nested Objective Added Successfully",
      data: updatedLocalExamination,
    });
  } catch (error) {
    console.error("Error adding nested objective:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
const addNestedObjectiveForSystemic = async (req, res) => {
  try {
    const { id } = req.params;
    const { subDisorderId, objectiveId, newObjective } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }
    if (!subDisorderId || typeof subDisorderId !== "string") {
      return res
        .status(400)
        .json({ error: "subDisorderId must be a non-empty string" });
    }
    if (!objectiveId || typeof objectiveId !== "string") {
      return res
        .status(400)
        .json({ error: "objectiveId must be a non-empty string" });
    }
    if (!newObjective || typeof newObjective !== "object") {
      return res.status(400).json({ error: "newObjective must be an object" });
    }

    const expectedFields = ["name", "answerType", "objective"];
    const hasAllFields = expectedFields.every((field) => field in newObjective);
    if (!hasAllFields) {
      return res.status(400).json({
        error: "newObjective must have name, answerType, and objective fields",
      });
    }
    if (
      typeof newObjective.name !== "string" ||
      typeof newObjective.answerType !== "string"
    ) {
      return res.status(400).json({
        error:
          "Invalid types in newObjective: name (string), answerType (string)",
      });
    }

    const SystemicExamination = await SystematicExaminationModel.findById(id);
    if (!SystemicExamination) {
      return res.status(404).json({ error: "Local Examination not found" });
    }

    const targetSubDisorder = SystemicExamination.exam.subDisorder.find(
      (subDisorder) => subDisorder._id.toString() === subDisorderId
    );
    if (!targetSubDisorder) {
      return res.status(404).json({
        error: "SubDisorder not found with the provided subDisorderId",
      });
    }

    const targetObjective = targetSubDisorder.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!targetObjective) {
      return res.status(404).json({
        error: "Objective item not found with the provided objectiveId",
      });
    }

    targetObjective.objective.push(newObjective);

    const updatedSystemicExamination = await SystemicExamination.save();

    res.status(httpStatus.OK).json({
      msg: "Nested Objective Added Successfully",
      data: updatedSystemicExamination,
    });
  } catch (error) {
    console.error("Error adding nested objective:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const updateLocalExamination = async (req, res) => {
  try {
    const { id } = req.params;
    const { subDisorder } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }
    if (!Array.isArray(subDisorder)) {
      return res.status(400).json({ error: "subDisorder must be an array" });
    }

    const expectedFields = ["name", "answerType", "objective"];
    for (const item of subDisorder) {
      const hasAllFields = expectedFields.every((field) => field in item);
      if (!hasAllFields) {
        return res.status(400).json({
          error:
            "Each subDisorder item must have name, answerType, and objective fields",
        });
      }

      if (
        typeof item.name !== "string" ||
        typeof item.answerType !== "string"
      ) {
        return res.status(400).json({
          error:
            "Invalid types in subDisorder item: name (string), answerType (string)",
        });
      }
      if (!Array.isArray(item.objective)) {
        return res.status(400).json({
          error: "objective must be an array in each subDisorder item",
        });
      }

      for (const obj of item.objective) {
        const nestedFields = ["name", "answerType", "count", "objective"];
        const hasNestedFields = nestedFields.every((field) => field in obj);
        if (!hasNestedFields) {
          return res.status(400).json({
            error:
              "Each objective item must have name, answerType, count, and objective fields",
          });
        }
        if (
          typeof obj.name !== "string" ||
          typeof obj.answerType !== "string" ||
          typeof obj.count !== "number"
        ) {
          return res.status(400).json({
            error:
              "Invalid types in objective item: name (string), answerType (string), count (number)",
          });
        }
        if (!Array.isArray(obj.objective)) {
          return res.status(400).json({
            error: "Nested objective must be an array in each objective item",
          });
        }
      }
    }

    const LocalExamination = await LocalExaminationModel.findById(id);
    if (!LocalExamination) {
      return res.status(404).json({ error: "Local Examination not found" });
    }

    LocalExamination.exam.subDisorder.push(...subDisorder);

    const newLocalExamination = await LocalExamination.save();

    res.status(httpStatus.CREATED).json({
      msg: "Local Examination Updated Successfully",
      data: newLocalExamination,
    });
  } catch (error) {
    console.error("Error updating Local Examination:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const updateLocalExaminationById = async (req, res) => {
  try {
    const LocalExamination = await LocalExaminationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(httpStatus.OK).json({
      msg: "Local Examination  Updated Successfully",
      LocalExamination,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Local Examination Not Found", error });
  }
};

const deleteLocalExaminationByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await LocalExaminationModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Local Examination found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Local Examination deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting Local Examination",
      details: err.message,
    });
  }
};

const GetMostUsedLocalExamination = async (req, res) => {
  try {
    const { id } = req.params;

    const LocalExamination = await LocalExaminationModel.find({
      delete: false,
      departmentId: id,
    }).sort({ createdAt: -1 });
    LocalExamination.forEach((exam) => {
      exam.exam.subDisorder.reverse();
      exam.exam.subDisorder = exam.exam.subDisorder.slice(0, 15);
    });

    res.status(httpStatus.OK).json({ data: LocalExamination });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteLocalExaminationSubDisorderByIds = async (req, res) => {
  try {
    const { deleteIds, id } = req.body;

    if (!deleteIds || !Array.isArray(deleteIds) || deleteIds.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = deleteIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const result = await LocalExaminationModel.findByIdAndUpdate(
      id,
      { $pull: { "exam.subDisorder": { _id: { $in: objectIdArray } } } },
      { new: true, multi: true }
    );

    res.status(httpStatus.OK).json({
      msg: "Local Examination subDisorder deleted successfully",
      result,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting Local Examination subDisorder",
      details: err.message,
    });
  }
};

const updateLocalExaminationSubDisorderById = async (req, res) => {
  try {
    const { objectId, subDisorderId } = req.params;
    const updateData = req.body;

    const result = await LocalExaminationModel.findOneAndUpdate(
      {
        _id: objectId,
        "exam.subDisorder._id": subDisorderId,
      },
      {
        $set: { "exam.subDisorder.$": updateData },
      },
      {
        new: true,
      }
    );

    res
      .status(httpStatus.OK)
      .json({ msg: "SubDisorder updated successfully", data: result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in updating Local Examination subDisorder",
      details: err.message,
    });
  }
};

const getModelByActiveTab = (activeTab) => {
  switch (activeTab) {
    case 0:
      return GeneralExaminationModel;
    case 1:
      return LocalExaminationModel;
    case 2:
      return SystematicExaminationModel;
    default:
      return null;
  }
};

const deleteExaminationInnerDataEntriesByIndex = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      secondIndex,
      thirdIndex,
      fourthIndex,
      innerDataIndexes,
      activeTab,
    } = req.body.ids;

    if (
      typeof secondIndex !== "number" ||
      typeof thirdIndex !== "number" ||
      !Array.isArray(innerDataIndexes) ||
      typeof activeTab !== "number"
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid request data", success: false });
    }

    const Model = getModelByActiveTab(activeTab);
    if (!Model) {
      return res.status(400).json({ msg: "Invalid activeTab", success: false });
    }

    const examination = await Model.findById(id);
    if (!examination) {
      return res.status(404).json({ msg: "Examination not found" });
    }

    const subdisorder = examination.exam?.subDisorder?.[secondIndex];
    if (!subdisorder) {
      return res
        .status(400)
        .json({ msg: "Invalid secondIndex", success: false });
    }

    const thirdLevel = subdisorder.objective?.[thirdIndex];
    if (!thirdLevel) {
      return res
        .status(400)
        .json({ msg: "Invalid thirdIndex", success: false });
    }

    let targetArray;
    if (typeof fourthIndex === "number") {
      const fourthLevel = thirdLevel.objective?.[fourthIndex];
      if (!fourthLevel || !Array.isArray(fourthLevel.objective)) {
        return res
          .status(400)
          .json({ msg: "Invalid fourthIndex", success: false });
      }
      targetArray = fourthLevel.objective;
    } else {
      if (!Array.isArray(thirdLevel.objective)) {
        return res.status(400).json({
          msg: "No valid nested objective array found",
          success: false,
        });
      }
      targetArray = thirdLevel.objective;
    }

    const sortedIndexes = innerDataIndexes.sort((a, b) => b - a);
    sortedIndexes.forEach((index) => {
      if (index >= 0 && index < targetArray.length) {
        targetArray.splice(index, 1);
      }
    });

    examination.markModified("exam.subDisorder");
    await examination.save();

    res.status(200).json({
      msg: `Layer ${
        typeof fourthIndex === "number" ? "5" : "4"
      } objective entries deleted successfully`,
      updatedData: examination,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error deleting objective entries",
      details: err.message,
      success: false,
    });
  }
};

const deleteExaminationObjectives = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const { subDisorderId, objectiveId, activeTab } = req.body.ids || req.body;

    console.table([subDisorderId, objectiveId, activeTab]);

    if (
      !subDisorderId ||
      !Array.isArray(objectiveId) ||
      objectiveId.length === 0 ||
      typeof activeTab !== "number"
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid request data", success: false });
    }

    const Model = getModelByActiveTab(activeTab);
    if (!Model) {
      return res.status(400).json({ msg: "Invalid activeTab", success: false });
    }

    const examination = await Model.findById(id);
    if (!examination) {
      return res.status(404).json({ msg: "Examination not found" });
    }

    console.log("Examination:", examination);

    if (!examination.exam || !Array.isArray(examination.exam.subDisorder)) {
      return res.status(400).json({
        msg: "Invalid examination structure: exam or subDisorder missing",
        success: false,
      });
    }

    const subDisorder = examination.exam.subDisorder.find(
      (sd) => sd._id.toString() === subDisorderId
    );
    if (!subDisorder || !Array.isArray(subDisorder.objective)) {
      return res.status(400).json({
        msg: "Invalid subDisorderId or no objectives found",
        success: false,
      });
    }

    console.log("SubDisorder:", subDisorder);
    console.log("Objectives before deletion:", subDisorder.objective);

    const objectiveIdsToDelete = objectiveId.map((id) => id.toString());

    console.log("Objective IDs to delete:", objectiveIdsToDelete);

    const initialLength = subDisorder.objective.length;
    subDisorder.objective = subDisorder.objective.filter(
      (obj) => !objectiveIdsToDelete.includes(obj._id.toString())
    );

    console.log("Objectives after deletion:", subDisorder.objective);

    if (subDisorder.objective.length === initialLength) {
      return res.status(400).json({
        msg: "No objectives were deleted: IDs may not match",
        success: false,
      });
    }

    examination.markModified("exam.subDisorder");
    await examination.save();

    console.log("Updated examination:", examination);

    res.status(200).json({
      msg: "Objectives deleted successfully",
      updatedData: examination,
      success: true,
    });
  } catch (err) {
    console.error("Error in deleteExaminationObjectives:", err);
    res.status(500).json({
      error: "Error deleting objectives",
      details: err.message,
      success: false,
    });
  }
};

function collectLastLayerObjectiveIds(objectives, ids = []) {
  if (!Array.isArray(objectives)) return ids;
  for (const obj of objectives) {
    if (Array.isArray(obj.objective) && obj.objective.length === 0) {
      ids.push(obj._id.toString());
    } else {
      collectLastLayerObjectiveIds(obj.objective, ids);
    }
  }
  return ids;
}

const deleteExaminationObjectivesfromFirstLayer = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Request body >>>", JSON.stringify(req.body));

    const { activeTab, ids } = req.body.ids;

    if (typeof activeTab !== "number" || !ids || typeof ids !== "object") {
      return res.status(400).json({
        msg: "Invalid request format",
        success: false,
      });
    }

    const subDisorderIndex = ids.subDisorderIndex;
    const idsToDelete = ids.ids;

    if (typeof subDisorderIndex !== "number" || !Array.isArray(idsToDelete)) {
      return res.status(400).json({
        msg: "Invalid subDisorderIndex or ids",
        success: false,
      });
    }

    const Model = getModelByActiveTab(activeTab);

    if (!Model) {
      return res.status(400).json({
        msg: "Invalid activeTab value",
        success: false,
      });
    }

    const examination = await Model.findById(id);
    console.log("examination>>>>>>>>>>>>>>>>>", examination);

    if (!examination) {
      return res.status(404).json({
        msg: "Examination not found",
        success: false,
      });
    }
    console.log("subDisorderIndex", subDisorderIndex);
    if (!examination.exam.subDisorder[subDisorderIndex]) {
      return res.status(404).json({
        msg: "SubDisorder not found",
        success: false,
      });
    }

    const subDisorder = examination.exam.subDisorder[subDisorderIndex];

    console.log("subDisorder>>>>>>>>>", subDisorder);

    subDisorder.objective = subDisorder.objective.filter((obj) => {
      const isMatched = idsToDelete.includes(obj._id.toString());
      console.log(
        `Checking objective ID: ${obj._id.toString()} - Will be deleted? ${isMatched}`
      );
      return !isMatched;
    });

    examination.markModified("exam.subDisorder");
    await examination.save();

    res.status(200).json({
      msg: "Objectives deleted successfully!",
      updatedData: examination,
      success: true,
    });
  } catch (err) {
    console.error("Error in deleteExaminationObjectives:", err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
      success: false,
    });
  }
};

const editExaminationDiagram = async (req, res) => {
  try {
    const { id } = req.params;
    const { activeTab, diagram } = req.body;
    if (typeof activeTab !== "number" || !diagram) {
      return res
        .status(400)
        .json({ msg: "Invalid request data", success: false });
    }

    const Model = getModelByActiveTab(activeTab);
    if (!Model) {
      return res.status(400).json({ msg: "Invalid activeTab", success: false });
    }

    const examination = await Model.findById(id);
    if (!examination) {
      return res.status(404).json({ msg: "Examination not found" });
    }

    examination.exam.diagram = diagram;

    examination.markModified("exam.diagram");
    await examination.save();

    res.status(200).json({
      msg: "Diagram updated successfully",
      updatedData: examination,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating diagram",
      details: err.message,
      success: false,
    });
  }
};
const examinationAddObjectiveOption = async (req, res) => {
  try {
    const { targetData, options, layer } = req.body;
    const { id } = req.params;

    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const doc = await GeneralExaminationModel.findById(id);
    if (!doc) return res.status(404).json({ message: "Parent not found" });

    if (layer === "one") {
      const subDisorder = doc.exam.subDisorder.id(targetData._id);
      if (!subDisorder)
        return res.status(404).json({ message: "SubDisorder not found" });

      console.log("subDisorder-------", subDisorder);
      options.forEach((opt) => {
        subDisorder.objective.push({
          name: opt.name,
          answerType: "Objective",
          objective: [],
        });
      });
    }
    if (layer === "two") {
      console.log("targetData------two-");

      const subDisorder = doc.exam.subDisorder.id(targetData.firstlayerId);
      if (!subDisorder)
        return res.status(404).json({ message: "SubDisorder not found" });

      console.log(
        "targetData.subDisorder.objective._id------",
        targetData.firstlayerId
      );
      console.log("subDisorder.objective------", subDisorder.objective);

      const mainTargetData = subDisorder.objective.id(targetData.nextlayerId);
      if (!mainTargetData)
        return res.status(404).json({ message: "Objective not found" });

      options.forEach((opt) => {
        mainTargetData.objective.push({
          name: opt.name,
          answerType: "Objective",
          objective: [],
        });
      });

      console.log("mainTargetData-------", mainTargetData);
    }

    if (layer === "three") {
      console.log("targetData------three-");

      const subDisorder = doc.exam.subDisorder.id(targetData.firstlayerId);
      if (!subDisorder)
        return res.status(404).json({ message: "SubDisorder not found" });

      console.log(
        "targetData.subDisorder.objective._id------",
        targetData.firstlayerId
      );
      console.log("subDisorder.objective------", subDisorder.objective);

      const mainTargetData = subDisorder.objective.id(targetData.nextlayerId);
      if (!mainTargetData)
        return res.status(404).json({ message: "Objective not found" });

      console.log("subDisorder.objective------", mainTargetData.objective);

      const lastTargetData = mainTargetData.objective.id(
        targetData.lastLayerId
      );
      if (!lastTargetData)
        return res.status(404).json({ message: "Objective not found" });

      options.forEach((opt) => {
        lastTargetData.objective.push({
          name: opt.name,
          answerType: "Objective",
          objective: [],
        });
      });

      console.log("mainTargetData-------", mainTargetData);
    }
    await doc.save();
    res.json({ message: "Options added", data: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const examinationAddObjectiveOptionForLocal = async (req, res) => {
  try {
    const { targetData, options, layer } = req.body;
    const { id } = req.params;

    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const doc = await LocalExaminationModel.findById(id);
    if (!doc) return res.status(404).json({ message: "Parent not found" });

    if (layer === "one") {
      const subDisorder = doc.exam.subDisorder.id(targetData._id);
      if (!subDisorder)
        return res.status(404).json({ message: "SubDisorder not found" });

      console.log("subDisorder-------", subDisorder);
      options.forEach((opt) => {
        subDisorder.objective.push({
          name: opt.name,
          answerType: "Objective",
          objective: [],
        });
      });
    }
    if (layer === "two") {
      console.log("targetData------two-");

      const subDisorder = doc.exam.subDisorder.id(targetData.firstlayerId);
      if (!subDisorder)
        return res.status(404).json({ message: "SubDisorder not found" });

      console.log(
        "targetData.subDisorder.objective._id------",
        targetData.firstlayerId
      );
      console.log("subDisorder.objective------", subDisorder.objective);

      const mainTargetData = subDisorder.objective.id(targetData.nextlayerId);
      if (!mainTargetData)
        return res.status(404).json({ message: "Objective not found" });

      options.forEach((opt) => {
        mainTargetData.objective.push({
          name: opt.name,
          answerType: "Objective",
          objective: [],
        });
      });

      console.log("mainTargetData-------", mainTargetData);
    }

    if (layer === "three") {
      console.log("targetData------three-");

      const subDisorder = doc.exam.subDisorder.id(targetData.firstlayerId);
      if (!subDisorder)
        return res.status(404).json({ message: "SubDisorder not found" });

      console.log(
        "targetData.subDisorder.objective._id------",
        targetData.firstlayerId
      );
      console.log("subDisorder.objective------", subDisorder.objective);

      const mainTargetData = subDisorder.objective.id(targetData.nextlayerId);
      if (!mainTargetData)
        return res.status(404).json({ message: "Objective not found" });

      console.log("subDisorder.objective------", mainTargetData.objective);

      const lastTargetData = mainTargetData.objective.id(
        targetData.lastLayerId
      );
      if (!lastTargetData)
        return res.status(404).json({ message: "Objective not found" });

      options.forEach((opt) => {
        lastTargetData.objective.push({
          name: opt.name,
          answerType: "Objective",
          objective: [],
        });
      });

      console.log("mainTargetData-------", mainTargetData);
    }
    await doc.save();
    res.json({ message: "Options added", data: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const examinationAddObjectiveOptionForSystemic = async (req, res) => {
  try {
    const { targetData, options, layer } = req.body;
    const { id } = req.params;

    console.log("Request body:", JSON.stringify(req.body, null, 2));

    const doc = await SystematicExaminationModel.findById(id);
    if (!doc) return res.status(404).json({ message: "Parent not found" });

    if (layer === "one") {
      const subDisorder = doc.exam.subDisorder.id(targetData._id);
      if (!subDisorder)
        return res.status(404).json({ message: "SubDisorder not found" });

      console.log("subDisorder-------", subDisorder);
      options.forEach((opt) => {
        subDisorder.objective.push({
          name: opt.name,
          answerType: "Objective",
          objective: [],
        });
      });
    }
    if (layer === "two") {
      console.log("targetData------two-");

      const subDisorder = doc.exam.subDisorder.id(targetData.firstlayerId);
      if (!subDisorder)
        return res.status(404).json({ message: "SubDisorder not found" });

      console.log(
        "targetData.subDisorder.objective._id------",
        targetData.firstlayerId
      );
      console.log("subDisorder.objective------", subDisorder.objective);

      const mainTargetData = subDisorder.objective.id(targetData.nextlayerId);
      if (!mainTargetData)
        return res.status(404).json({ message: "Objective not found" });

      options.forEach((opt) => {
        mainTargetData.objective.push({
          name: opt.name,
          answerType: "Objective",
          objective: [],
        });
      });

      console.log("mainTargetData-------", mainTargetData);
    }

    if (layer === "three") {
      console.log("targetData------three-");

      const subDisorder = doc.exam.subDisorder.id(targetData.firstlayerId);
      if (!subDisorder)
        return res.status(404).json({ message: "SubDisorder not found" });

      console.log(
        "targetData.subDisorder.objective._id------",
        targetData.firstlayerId
      );
      console.log("subDisorder.objective------", subDisorder.objective);

      const mainTargetData = subDisorder.objective.id(targetData.nextlayerId);
      if (!mainTargetData)
        return res.status(404).json({ message: "Objective not found" });

      console.log("subDisorder.objective------", mainTargetData.objective);

      const lastTargetData = mainTargetData.objective.id(
        targetData.lastLayerId
      );
      if (!lastTargetData)
        return res.status(404).json({ message: "Objective not found" });

      options.forEach((opt) => {
        lastTargetData.objective.push({
          name: opt.name,
          answerType: "Objective",
          objective: [],
        });
      });

      console.log("mainTargetData-------", mainTargetData);
    }
    await doc.save();
    res.json({ message: "Options added", data: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const editExaminationInnerDataEntry = async (req, res) => {
  console.log("is akjassdk  isdijn");
  try {
    const { id } = req.params;
    const {
      activeTab,
      subDisorderId,
      objectiveId,
      data,
      lastLayerId,
      morelastLayerId,
    } = req.body;

    console.log("req.body:", JSON.stringify(req.body, null, 2));
    if (
      typeof activeTab !== "number" ||
      !subDisorderId ||
      !objectiveId ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid request data", success: false });
    }

    const Model = getModelByActiveTab(activeTab);
    if (!Model) {
      return res.status(400).json({ msg: "Invalid activeTab", success: false });
    }

    const examination = await Model.findById(id);
    if (!examination) {
      return res.status(404).json({ msg: "Examination not found" });
    }

    const subDisorder = examination.exam?.subDisorder?.find(
      (sd) => sd._id.toString() === subDisorderId
    );
    if (!subDisorder) {
      return res
        .status(400)
        .json({ msg: "Invalid subDisorderId", success: false });
    }

    const objectiveItem = subDisorder.objective?.find(
      (obj) => obj._id.toString() === objectiveId
    );

    if (!objectiveItem) {
      return res
        .status(404)
        .json({ msg: "Objective not found", success: false });
    }

    const lastLayerObjective = objectiveItem.objective?.find(
      (obj) => obj._id.toString() === lastLayerId
    );

    if (!lastLayerObjective) {
      return res
        .status(404)
        .json({ msg: "Last layer objective not found", success: false });
    }
    if (!morelastLayerId) {
      lastLayerObjective.name = data;
    } else {
      const lastMoreLayerObjective = lastLayerObjective.objective?.find(
        (obj) => obj._id.toString() === morelastLayerId
      );
      lastMoreLayerObjective.name = data;
    }

    examination.markModified("exam.subDisorder");
    await examination.save();

    res.status(200).json({
      msg: "Objective name updated successfully",
      updatedData: examination,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating objective name",
      details: err.message,
      success: false,
    });
  }
};

const editExaminationObjectiveDataLayer3 = async (req, res) => {
  try {
    const { id } = req.params;
    const { activeTab, subDisorderId, objectiveId, data } = req.body;

    if (
      typeof activeTab !== "number" ||
      typeof subDisorderId !== "string" ||
      typeof objectiveId !== "string" ||
      typeof data !== "string"
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid request data", success: false });
    }

    const Model = getModelByActiveTab(activeTab);
    if (!Model) {
      return res.status(400).json({ msg: "Invalid activeTab", success: false });
    }

    const examination = await Model.findById(id);
    if (!examination) {
      return res.status(404).json({ msg: "Examination not found" });
    }

    const subDisorder = examination.exam?.subDisorder?.find(
      (item) => item.id === subDisorderId
    );
    if (!subDisorder) {
      return res
        .status(400)
        .json({ msg: "SubDisorder not found", success: false });
    }

    if (!subDisorder.objective || !Array.isArray(subDisorder.objective)) {
      return res
        .status(400)
        .json({ msg: "Objective array not found", success: false });
    }
    const objectiveItem = subDisorder.objective.find(
      (item) => item.id === objectiveId
    );
    if (!objectiveItem) {
      return res
        .status(400)
        .json({ msg: "Objective item not found", success: false });
    }

    objectiveItem.name = data;

    examination.markModified("exam.subDisorder");

    await examination.save();

    res.status(200).json({
      msg: "Objective data updated successfully",
      updatedData: examination,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating objective data",
      details: err.message,
      success: false,
    });
  }
};

const createGeneralExamination = async (req, res) => {
  try {
    const newGeneralExamination = new GeneralExaminationModel({ ...req.body });
    const savedGeneralExamination = await newGeneralExamination.save();
    res.status(httpStatus.CREATED).json({
      msg: "General Examination Added Successfully ",
      data: savedGeneralExamination,
    });
  } catch (error) {
    console.error("Error storing Risk Factor:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllGeneralExamination = async (req, res) => {
  try {
    const GeneralExamination = await GeneralExaminationModel.find({
      delete: false,
    });
    res.status(httpStatus.OK).json({ data: GeneralExamination });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const addNestedObjective = async (req, res) => {
  try {
    const { id } = req.params;
    const { subDisorderId, objectiveId, newObjective } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }
    if (!subDisorderId || typeof subDisorderId !== "string") {
      return res
        .status(400)
        .json({ error: "subDisorderId must be a non-empty string" });
    }
    if (!objectiveId || typeof objectiveId !== "string") {
      return res
        .status(400)
        .json({ error: "objectiveId must be a non-empty string" });
    }
    if (!newObjective || typeof newObjective !== "object") {
      return res.status(400).json({ error: "newObjective must be an object" });
    }

    const expectedFields = ["name", "answerType", "objective"];
    const hasAllFields = expectedFields.every((field) => field in newObjective);
    if (!hasAllFields) {
      return res.status(400).json({
        error:
          "newObjective must have name, answerType, count, and objective fields",
      });
    }
    if (
      typeof newObjective.name !== "string" ||
      typeof newObjective.answerType !== "string"
    ) {
      return res.status(400).json({
        error:
          "Invalid types in newObjective: name (string), answerType (string)",
      });
    }

    const GeneralExamination = await GeneralExaminationModel.findById(id);
    if (!GeneralExamination) {
      return res.status(404).json({ error: "General Examination not found" });
    }

    const targetSubDisorder = GeneralExamination.exam.subDisorder.find(
      (subDisorder) => subDisorder._id.toString() === subDisorderId
    );
    if (!targetSubDisorder) {
      return res.status(404).json({
        error: "SubDisorder not found with the provided subDisorderId",
      });
    }

    const targetObjective = targetSubDisorder.objective.find(
      (obj) => obj._id.toString() === objectiveId
    );
    if (!targetObjective) {
      return res.status(404).json({
        error: "Objective item not found with the provided objectiveId",
      });
    }

    targetObjective.objective.push(newObjective);

    const updatedGeneralExamination = await GeneralExamination.save();

    res.status(httpStatus.OK).json({
      msg: "Nested Objective Added Successfully",
      data: updatedGeneralExamination,
    });
  } catch (error) {
    console.error("Error adding nested objective:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const addMostNestedObjective = async (req, res) => {
  try {
    const { id } = req.params;
    const { subDisorderId, firstLayerId, lastLayerId, newObjective } = req.body;
    console.log("Request body:", req.body);

    if (
      !id ||
      !subDisorderId ||
      !firstLayerId ||
      !lastLayerId ||
      !newObjective
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields in request" });
    }

    const doc = await GeneralExaminationModel.findById(id);
    if (!doc)
      return res.status(404).json({ error: "General Examination not found" });

    const subDisorder = doc.exam.subDisorder.find(
      (sub) => sub._id.toString() === subDisorderId
    );
    if (!subDisorder)
      return res.status(404).json({ error: "SubDisorder not found" });

    const findObjectiveById = (objectives, targetId) => {
      for (let obj of objectives) {
        if (obj._id.toString() === targetId) return obj;
        if (obj.objective && obj.objective.length) {
          const found = findObjectiveById(obj.objective, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const firstLayer = findObjectiveById(subDisorder.objective, firstLayerId);
    if (!firstLayer)
      return res.status(404).json({ error: "First Layer objective not found" });

    const lastLayer = findObjectiveById([firstLayer], lastLayerId);
    if (!lastLayer)
      return res.status(404).json({ error: "Last Layer objective not found" });

    lastLayer.objective.push(newObjective);

    await doc.save();
    res
      .status(httpStatus.OK)
      .json({ msg: "Nested Objective Added Successfully", data: doc });
  } catch (error) {
    console.error("Error adding nested objective:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const addMostNestedObjectiveForLocal = async (req, res) => {
  try {
    const { id } = req.params;
    const { subDisorderId, firstLayerId, lastLayerId, newObjective } = req.body;
    console.log("Request body:", req.body);

    if (
      !id ||
      !subDisorderId ||
      !firstLayerId ||
      !lastLayerId ||
      !newObjective
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields in request" });
    }

    const doc = await LocalExaminationModel.findById(id);
    if (!doc)
      return res.status(404).json({ error: "General Examination not found" });

    const subDisorder = doc.exam.subDisorder.find(
      (sub) => sub._id.toString() === subDisorderId
    );
    if (!subDisorder)
      return res.status(404).json({ error: "SubDisorder not found" });

    const findObjectiveById = (objectives, targetId) => {
      for (let obj of objectives) {
        if (obj._id.toString() === targetId) return obj;
        if (obj.objective && obj.objective.length) {
          const found = findObjectiveById(obj.objective, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const firstLayer = findObjectiveById(subDisorder.objective, firstLayerId);
    if (!firstLayer)
      return res.status(404).json({ error: "First Layer objective not found" });

    const lastLayer = findObjectiveById([firstLayer], lastLayerId);
    if (!lastLayer)
      return res.status(404).json({ error: "Last Layer objective not found" });

    lastLayer.objective.push(newObjective);

    await doc.save();
    res
      .status(httpStatus.OK)
      .json({ msg: "Nested Objective Added Successfully", data: doc });
  } catch (error) {
    console.error("Error adding nested objective:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const updateGeneralExamination = async (req, res) => {
  try {
    const { id } = req.params;
    const { subDisorder } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }
    if (!Array.isArray(subDisorder)) {
      return res.status(400).json({ error: "subDisorder must be an array" });
    }

    const expectedFields = ["name", "answerType", "objective"];
    for (const item of subDisorder) {
      const hasAllFields = expectedFields.every((field) => field in item);
      if (!hasAllFields) {
        return res.status(400).json({
          error:
            "Each subDisorder item must have name, count, answerType, and objective fields",
        });
      }

      if (
        typeof item.name !== "string" ||
        typeof item.answerType !== "string"
      ) {
        return res.status(400).json({
          error:
            "Invalid types in subDisorder item: name (string),  answerType (string)",
        });
      }
      if (!Array.isArray(item.objective)) {
        return res.status(400).json({
          error: "objective must be an array in each subDisorder item",
        });
      }

      for (const obj of item.objective) {
        const nestedFields = ["name", "answerType", "count", "objective"];
        const hasNestedFields = nestedFields.every((field) => field in obj);
        if (!hasNestedFields) {
          return res.status(400).json({
            error:
              "Each objective item must have name, answerType, count, and objective fields",
          });
        }
        if (
          typeof obj.name !== "string" ||
          typeof obj.answerType !== "string" ||
          typeof obj.count !== "number"
        ) {
          return res.status(400).json({
            error:
              "Invalid types in objective item: name (string), answerType (string), count (number)",
          });
        }
        if (!Array.isArray(obj.objective)) {
          return res.status(400).json({
            error: "Nested objective must be an array in each objective item",
          });
        }
      }
    }

    const GeneralExamination = await GeneralExaminationModel.findById(id);
    if (!GeneralExamination) {
      return res.status(404).json({ error: "General Examination not found" });
    }

    GeneralExamination.exam.subDisorder.push(...subDisorder);

    const newGeneralExamination = await GeneralExamination.save();

    res.status(httpStatus.CREATED).json({
      msg: "General Examination Updated Successfully",
      data: newGeneralExamination,
    });
  } catch (error) {
    console.error("Error updating General Examination:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const updateGeneralExaminationById = async (req, res) => {
  try {
    const GeneralExamination = await GeneralExaminationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(httpStatus.OK).json({
      msg: "General Examination  Updated Successfully",
      GeneralExamination,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "General Examination Not Found", error });
  }
};

const deleteGeneralExaminationByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await GeneralExaminationModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No General Examination found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "General Examination deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting General Examination",
      details: err.message,
    });
  }
};

const GetMostUsedGeneralExamination = async (req, res) => {
  try {
    const { id } = req.params;

    const GeneralExamination = await GeneralExaminationModel.find({
      delete: false,
      departmentId: id,
    }).sort({ createdAt: -1 });
    GeneralExamination.forEach((exam) => {
      exam.exam.subDisorder.reverse();
      exam.exam.subDisorder = exam.exam.subDisorder.slice(0, 15);
    });

    res.status(httpStatus.OK).json({ data: GeneralExamination });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteGeneralExaminationSubDisorderByIds = async (req, res) => {
  try {
    const { deleteIds, id } = req.body;

    if (!deleteIds || !Array.isArray(deleteIds) || deleteIds.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = deleteIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const result = await GeneralExaminationModel.findByIdAndUpdate(
      id,
      { $pull: { "exam.subDisorder": { _id: { $in: objectIdArray } } } },
      { new: true, multi: true }
    );

    res.status(httpStatus.OK).json({
      msg: "General Examination subDisorder deleted successfully",
      result,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting General Examination subDisorder",
      details: err.message,
    });
  }
};

const updateGeneralExaminationSubDisorderById = async (req, res) => {
  try {
    const { objectId, subDisorderId } = req.params;
    const updateData = req.body;

    const result = await GeneralExaminationModel.findOneAndUpdate(
      {
        _id: objectId,
        "exam.subDisorder._id": subDisorderId,
      },
      {
        $set: { "exam.subDisorder.$": updateData },
      },
      {
        new: true,
      }
    );

    res
      .status(httpStatus.OK)
      .json({ msg: "SubDisorder updated successfully", data: result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in updating Local Examination subDisorder",
      details: err.message,
    });
  }
};

const createSystematicExamination = async (req, res) => {
  try {
    const newSystematicExamination = new SystematicExaminationModel({
      ...req.body,
    });
    const savedSystematicExamination = await newSystematicExamination.save();
    res.status(httpStatus.CREATED).json({
      msg: "Systematic Examination Added Successfully ",
      data: savedSystematicExamination,
    });
  } catch (error) {
    console.error("Error storing Systematic Examination:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllSystematicExamination = async (req, res) => {
  try {
    const SystematicExamination = await SystematicExaminationModel.find({
      delete: false,
    });
    res.status(httpStatus.OK).json({ data: SystematicExamination });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateSystematicExamination = async (req, res) => {
  try {
    const { id } = req.params;
    const { subDisorder } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }
    if (!Array.isArray(subDisorder)) {
      return res.status(400).json({ error: "subDisorder must be an array" });
    }

    const expectedFields = ["name", "answerType", "objective"];
    for (const item of subDisorder) {
      const hasAllFields = expectedFields.every((field) => field in item);
      if (!hasAllFields) {
        return res.status(400).json({
          error:
            "Each subDisorder item must have name, answerType, and objective fields",
        });
      }

      if (
        typeof item.name !== "string" ||
        typeof item.answerType !== "string"
      ) {
        return res.status(400).json({
          error:
            "Invalid types in subDisorder item: name (string), answerType (string)",
        });
      }
      if (!Array.isArray(item.objective)) {
        return res.status(400).json({
          error: "objective must be an array in each subDisorder item",
        });
      }

      for (const obj of item.objective) {
        const nestedFields = ["name", "answerType", "count", "objective"];
        const hasNestedFields = nestedFields.every((field) => field in obj);
        if (!hasNestedFields) {
          return res.status(400).json({
            error:
              "Each objective item must have name, answerType, count, and objective fields",
          });
        }
        if (
          typeof obj.name !== "string" ||
          typeof obj.answerType !== "string" ||
          typeof obj.count !== "number"
        ) {
          return res.status(400).json({
            error:
              "Invalid types in objective item: name (string), answerType (string), count (number)",
          });
        }
        if (!Array.isArray(obj.objective)) {
          return res.status(400).json({
            error: "Nested objective must be an array in each objective item",
          });
        }
      }
    }

    const SystematicExamination = await SystematicExaminationModel.findById(id);
    if (!SystematicExamination) {
      return res
        .status(404)
        .json({ error: "Systematic Examination not found" });
    }

    SystematicExamination.exam.subDisorder.push(...subDisorder);

    const newSystematicExamination = await SystematicExamination.save();

    res.status(httpStatus.CREATED).json({
      msg: "Systematic Examination Updated Successfully",
      data: newSystematicExamination,
    });
  } catch (error) {
    console.error("Error updating Systematic Examination:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const updateAllSystematicExamination = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSystematicExamination =
      await SystematicExaminationModel.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true }
      );
    res.status(httpStatus.CREATED).json({
      msg: "Systematic Examination  Updated Successfully ",
      data: updatedSystematicExamination,
    });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateDiagramInSystematicExamination = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagram } = req.body;

    if (!diagram) {
      return res.status(400).json({ error: "Diagram data is required" });
    }

    const updatedSystematicExamination =
      await SystematicExaminationModel.findByIdAndUpdate(
        id,
        { $set: { "exam.diagram": diagram } },
        { new: true }
      );

    if (!updatedSystematicExamination) {
      return res
        .status(404)
        .json({ error: "Systematic Examination not found" });
    }

    res.status(200).json({
      msg: "Diagram Updated Successfully",
      data: updatedSystematicExamination,
    });
  } catch (error) {
    console.error("Error updating diagram:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateDiagramInSystematicExaminationDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSystematicExamination =
      await SystematicExaminationModel.findByIdAndUpdate(
        id,
        { $set: { "exam.diagram": "" } },
        { new: true }
      );

    if (!updatedSystematicExamination) {
      return res
        .status(404)
        .json({ error: "Systematic Examination not found" });
    }

    res.status(200).json({
      msg: "Diagram deleted Successfully",
      data: updatedSystematicExamination,
    });
  } catch (error) {
    console.error("Error updating diagram:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addMostNestedObjectiveForSystemic = async (req, res) => {
  try {
    const { id } = req.params;
    const { subDisorderId, firstLayerId, lastLayerId, newObjective } = req.body;
    console.log("Request body:", req.body);

    if (
      !id ||
      !subDisorderId ||
      !firstLayerId ||
      !lastLayerId ||
      !newObjective
    ) {
      return res
        .status(400)
        .json({ error: "Missing required fields in request" });
    }

    const doc = await SystematicExaminationModel.findById(id);
    if (!doc)
      return res.status(404).json({ error: "General Examination not found" });

    const subDisorder = doc.exam.subDisorder.find(
      (sub) => sub._id.toString() === subDisorderId
    );
    if (!subDisorder)
      return res.status(404).json({ error: "SubDisorder not found" });

    const findObjectiveById = (objectives, targetId) => {
      for (let obj of objectives) {
        if (obj._id.toString() === targetId) return obj;
        if (obj.objective && obj.objective.length) {
          const found = findObjectiveById(obj.objective, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const firstLayer = findObjectiveById(subDisorder.objective, firstLayerId);
    if (!firstLayer)
      return res.status(404).json({ error: "First Layer objective not found" });

    const lastLayer = findObjectiveById([firstLayer], lastLayerId);
    if (!lastLayer)
      return res.status(404).json({ error: "Last Layer objective not found" });

    lastLayer.objective.push(newObjective);

    await doc.save();
    res
      .status(httpStatus.OK)
      .json({ msg: "Nested Objective Added Successfully", data: doc });
  } catch (error) {
    console.error("Error adding nested objective:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};

const deleteSystematicExaminationByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await SystematicExaminationModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Systematic Examination found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Systematic Examination deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting Systematic Examination",
      details: err.message,
    });
  }
};

const GetMostUsedSystematicExamination = async (req, res) => {
  try {
    const { id } = req.params;

    const SystematicExamination = await SystematicExaminationModel.find({
      delete: false,
      departmentId: id,
    }).sort({ createdAt: -1 });
    SystematicExamination.forEach((exam) => {
      exam.exam.subDisorder.reverse();
      exam.exam.subDisorder = exam.exam.subDisorder.slice(0, 15);
    });

    res.status(httpStatus.OK).json({ data: SystematicExamination });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteSystematicExaminationSubDisorderByIds = async (req, res) => {
  try {
    const { deleteIds, id } = req.body;

    if (!deleteIds || !Array.isArray(deleteIds) || deleteIds.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = deleteIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const result = await SystematicExaminationModel.findByIdAndUpdate(
      id,
      { $pull: { "exam.subDisorder": { _id: { $in: objectIdArray } } } },
      { new: true, multi: true }
    );

    res.status(httpStatus.OK).json({
      msg: "Systematic ExaminationModel subDisorder deleted successfully",
      result,
    });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting Systematic ExaminationModel subDisorder",
      details: err.message,
    });
  }
};

const updateSystematicExaminationSubDisorderById = async (req, res) => {
  try {
    const { objectId, subDisorderId } = req.params;
    const updateData = req.body;

    const result = await SystematicExaminationModel.findOneAndUpdate(
      {
        _id: objectId,
        "exam.subDisorder._id": subDisorderId,
      },
      {
        $set: { "exam.subDisorder.$": updateData },
      },
      {
        new: true,
      }
    );

    res
      .status(httpStatus.OK)
      .json({ msg: "SubDisorder updated successfully", data: result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in updating Local Examination subDisorder",
      details: err.message,
    });
  }
};

const createOtherExamination = async (req, res) => {
  try {
    const newOtherExamination = new OtherExaminationModel({ ...req.body });
    const savedOtherExamination = await newOtherExamination.save();
    res.status(httpStatus.CREATED).json({
      msg: "Other Examination Added Successfully ",
      data: savedOtherExamination,
    });
  } catch (error) {
    console.error("Error storing Risk Factor:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllOtherExamination = async (req, res) => {
  try {
    const OtherExamination = await OtherExaminationModel.find({
      delete: false,
    });
    res.status(httpStatus.OK).json({ data: OtherExamination });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateOtherExaminationById = async (req, res) => {
  try {
    const OtherExamination = await OtherExaminationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(httpStatus.OK).json({
      msg: "Other Examination  Updated Successfully",
      OtherExamination,
    });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Other Examination Not Found", error });
  }
};

const deleteOtherExaminationByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid or missing IDs array" });
    }

    const objectIdArray = ids.map((id) => id.toString());

    const result = await OtherExaminationModel.deleteMany({
      _id: { $in: objectIdArray },
      delete: false,
    });

    if (result.deletedCount === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Other Examination found with the provided IDs" });
    }

    res
      .status(httpStatus.OK)
      .json({ msg: "Other Examination deleted successfully", result });
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Error in deleting Other Examination",
      details: err.message,
    });
  }
};

const GetMostUsedOtherExamination = async (req, res) => {
  try {
    const { id } = req.params;
    const OtherExamination = await OtherExaminationModel.find({
      delete: false,
      departmentId: id,
    })
      .sort({ createdAt: -1 })
      .limit(15);
    res.status(httpStatus.OK).json({ data: OtherExamination });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const GetMostUsedSurgeryPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const surgeryPackage = await SurgeryPackageModel.find({
      delete: false,
      departmentId: id,
    })
      .sort({ count: -1 })
      .limit(30);
    res.status(httpStatus.OK).json({ data: surgeryPackage });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const GetMostUsedRadiologyInvest = async (req, res) => {
  try {
    const { id } = req.params;
    const RadiologyInvest = await InvestigationRadiologyMasterModel.find({
      delete: false,
      departmentId: id,
    })
      .sort({ count: -1 })
      .limit(30);
    res.status(httpStatus.OK).json({ data: RadiologyInvest });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const GetMostUsedPathologyInvest = async (req, res) => {
  try {
    const { id } = req.params;
    const PathologygyInvest = await InvestigationPathologyMasterModel.find({
      delete: false,
      departmentId: id,
    })
      .sort({ count: -1 })
      .limit(30);
    res.status(httpStatus.OK).json({ data: PathologygyInvest });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getAllPatientData = async (req, res) => {
  try {
    const { patientId } = req.params;
    const OPDAll = await OPDModel.find({
      patientId: patientId,
      confirmAppointment: true,
    });
    if (!OPDAll || OPDAll.length === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Patient data not found" });
    }

    const patientData = [];
    for (const opd of OPDAll) {
      const currentDate = new Date(opd.createdAt).toISOString().split("T")[0];

      const chiefComplaintAll = await PatientChiefComplaintModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate },
      });
      const provisionalDiagnosisAll =
        await PatientProvisionalDiagnosisModel.find({
          patientId: opd._id.toString(),
          createdAt: { $gte: currentDate },
        });
      const procedureAll = await PatientProcedureModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate },
      });
      const instructionAll = await PatientInstructionModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate },
      });
      const vitalsAll = await PatientVitalsModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate },
      });
      const labRadiologyAll = await PatientLabRadiologyModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate },
      });
      const examinationAll = await PatientExaminationModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate },
      });
      const historyAll = await PatientHistroyModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate },
      });
      const presentIllnessAll = await PatientPresentIllnessHistoryModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate },
      });
      const glassPrescriptionAll = await PatientGlassPrescriptionModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate },
      });
      const followUpAll = await PatientFollowUpModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate },
      });
      const finalDiagnosisAll = await PatientFinalDiagnosisModel.find({
        patientId: opd._id.toString(),
        createdAt: { $gte: currentDate },
      });
      const medicalPrescriptionAll = await PatientMedicalPrescriptionModel.find(
        {
          patientId: opd._id.toString(),
          createdAt: { $gte: currentDate },
        }
      );

      patientData.push({
        chiefComplaint: chiefComplaintAll,
        provisionalDiagnosis: provisionalDiagnosisAll,
        procedure: procedureAll,
        instruction: instructionAll,
        vitals: vitalsAll,
        labRadiology: labRadiologyAll,
        examination: examinationAll,
        history: historyAll,
        presentIllness: presentIllnessAll,
        glassPrescription: glassPrescriptionAll,
        followUp: followUpAll,
        finalDiagnosis: finalDiagnosisAll,
        medicalPrescription: medicalPrescriptionAll,
        consultant: opd.consultant,
        consultantId: opd.consultantId,
        createdAt: currentDate,
      });
    }
    res.status(httpStatus.OK).json({
      patientData: patientData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getAllPatientdataToPrint = async (req, res) => {
  try {
    const { patientId, consultantId } = req.params;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const chiefComplaintAll = await PatientChiefComplaintModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate },
    });
    const provisionalDiagnosisAll = await PatientProvisionalDiagnosisModel.find(
      {
        patientId: patientId,
        consultantId: consultantId,
        createdAt: { $gte: currentDate },
      }
    );
    const procedureAll = await PatientProcedureModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate },
    });
    const instructionAll = await PatientInstructionModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate },
    });
    const vitalsAll = await PatientVitalsModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate },
    });
    const labRadiologyAll = await PatientLabRadiologyModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate },
    });
    const examinationAll = await PatientExaminationModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate },
    });
    const historyAll = await PatientHistroyModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate },
    });
    const presentIllnessAll = await PatientPresentIllnessHistoryModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate },
    });
    const glassPrescriptionAll = await PatientGlassPrescriptionModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate },
    });
    const followUpAll = await PatientFollowUpModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate },
    });
    const finalDiagnosisAll = await PatientFinalDiagnosisModel.find({
      patientId: patientId,
      consultantId: consultantId,
      createdAt: { $gte: currentDate },
    });

    const medicalPrescriptionAll =
      await EmergencyPatientMedicalPrescriptionModel.find({
        patientId: patientId,
        consultantId: consultantId,
        createdAt: { $gte: currentDate },
      });

    res.status(httpStatus.OK).json({
      patientData: [
        {
          chiefComplaint: chiefComplaintAll,
          provisionalDiagnosis: provisionalDiagnosisAll,
          procedure: procedureAll,
          instruction: instructionAll,
          vitals: vitalsAll,
          labRadiology: labRadiologyAll,
          examination: examinationAll,
          history: historyAll,
          presentIllness: presentIllnessAll,
          glassPrescription: glassPrescriptionAll,
          followUp: followUpAll,
          finalDiagnosis: finalDiagnosisAll,
          medicalPrescription: medicalPrescriptionAll,
        },
      ],
    });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const generateInvoiceNumber = async () => {
  let invoiceNumber = await InvoiceNoModel.findOne();

  if (!invoiceNumber) {
    invoiceNumber = new InvoiceNoModel({ invoiceNo: "1" });
  } else {
    const incrementedInvoiceNo = (
      parseInt(invoiceNumber.invoiceNo) + 1
    ).toString();
    invoiceNumber.invoiceNo = incrementedInvoiceNo;
  }

  await invoiceNumber.save();
  return invoiceNumber.invoiceNo;
};

const createOPDBilling = async (req, res) => {
  try {
    const { opdId, paidAmount, charges, discountCharges, finalAmount } =
      req.body;
    const opd = await OpdPatientModel.findById(opdId);

    if (!opd) {
      return res.status(httpStatus.NOT_FOUND).json({ error: "OPD not found" });
    }

    const totalPaidAmount = opd.paidAmount + paidAmount;

    let billingStatus = "Non_Paid";
    if (totalPaidAmount >= finalAmount) {
      billingStatus = "Paid";
    } else if (totalPaidAmount > 0) {
      billingStatus = "Partially_Paid";
    }

    await OpdPatientModel.findByIdAndUpdate(
      opdId,
      {
        billingStatus,
        totalAmount: charges,
        discountAmount: discountCharges,
        finalAmount: finalAmount,
        paidAmount: totalPaidAmount,
        confirmAppointment: billingStatus === "Paid",
      },
      { new: true }
    );

    const invoiceNumber = await generateInvoiceNumber();

    const opdbilling = new OPDBillingModel({
      ...req.body,
      invoiceNo: invoiceNumber,
    });

    const servicesType = opdbilling.services.map((service) => service.type);
    const servicesId = opdbilling.services.map((service) => service.refId);

    const updateServiceCount = async (serviceType, serviceModel) => {
      const services = await serviceModel.find({ _id: { $in: servicesId } });
      services.forEach((service) => {
        const newserviceDetails = opdbilling.services.find(
          (p) => p.refId === service._id.toString()
        );
        if (newserviceDetails) {
          service.count = (service.count || 0) + 1;
        }
      });
      await Promise.all(services.map((service) => service.save()));
    };

    if (servicesType.includes("Services")) {
      await updateServiceCount("Services", ServiceDetailsModel);
    } else if (servicesType.includes("Investigation")) {
      await updateServiceCount("Investigation", ServiceDetailsModel);
    } else if (servicesType.includes("OPD Package")) {
      await updateServiceCount("OPD Package", OPDPackageModel);
    }

    const savedOpdBilling = await opdbilling.save();

    res
      .status(httpStatus.OK)
      .json({ msg: "OPD Billing created successfully", data: savedOpdBilling });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error", error });
  }
};

const getOPDBilling = async (req, res) => {
  try {
    const { patientId, opdId } = req.params;
    const billingData = [];
    const opdbilling = await OPDBillingModel.find({
      opdId: opdId,
      delete: false,
    });
    const opd = await OPDModel.find({ patientId: patientId, delete: false });
    if (!opd) {
      return res.status(httpStatus.NOT_FOUND).json({ error: "OPD not found" });
    }
    billingData.push({ opdbilling: opdbilling ?? null }, { opd: opd });

    res
      .status(httpStatus.OK)
      .json({ msg: "OPD Billing found", data: billingData });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getMostUsedServiceDetails = async (req, res) => {
  try {
    const { departmentId, patientPayeeId } = req.params;

    const serviceDetails = await ServiceDetailsModel.find({
      departmentId,
      patientPayeeId,
      delete: false,
      whichService: "Service",
      patientType: "Regular",
      patientEncounter: "OPD",
    })
      .sort({ count: -1 })
      .limit(20);

    const investigationDetails = await ServiceDetailsModel.find({
      departmentId,
      patientPayeeId,
      delete: false,
      whichService: { $ne: "Service" },
      patientType: "Regular",
      patientEncounter: "OPD",
    })
      .sort({ count: -1 })
      .limit(20);

    const opdDetails = await OPDPackageModel.find({
      departmentId,
      patientPayeeId,
      delete: false,
      patientType: "Regular",
      patientEncounter: "OPD",
    })
      .sort({ count: -1 })
      .limit(30);

    res.status(httpStatus.OK).json({
      msg: "Most Used Service Details found",
      data: {
        services: serviceDetails,
        investigation: investigationDetails,
        OPD: opdDetails,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getPatientCountByConsultant = async (req, res) => {
  try {
    const user = await AdminModel.findById(req.user.adminId);
    if (user.role == "doctor") {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const totalPatients = OPDModel.countDocuments({
        delete: false,
        consultantId: req.user.branchId,
        confirmAppointment: true,
        createdAt: { $gte: currentDate },
      });

      const checkPatients = OPDModel.countDocuments({
        delete: false,
        consultantId: req.user.branchId,
        confirmAppointment: true,
        status: "out",
        createdAt: { $gte: currentDate },
      });

      const watingPatients = OPDModel.countDocuments({
        delete: false,
        consultantId: req.user.branchId,
        confirmAppointment: true,
        status: "pending",
        createdAt: { $gte: currentDate },
      });

      const patientCount = await Promise.all([
        totalPatients,
        checkPatients,
        watingPatients,
      ]);

      res.status(httpStatus.OK).json({
        msg: "Patient Count found",
        data: {
          totalPatients: patientCount[0],
          checkPatients: patientCount[1],
          watingPatients: patientCount[2],
        },
      });
    } else {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: "You are not authorized to access this route" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

module.exports = {
  createOpdRegistion,
  updateOpdRegistion,
  changeConfirmAppointmentStatus,
  changeCancelAppointmentStatus,
  getAllOpdRegistration,
  getCountByConsultant,
  getOPDRegistrationResponse,
  getOPDRegistrationBYBilling,
  changePatientInStatus,

  createMedicalProblem,
  getAllMedicalProblem,
  updateMedicalProblem,
  deleteMedicalProblemById,
  GetMostUsedMedicalProblem,
  createFamilyHistoryProblem,
  getAllFamilyHistoryProblems,
  updateFamilyHistoryProblem,
  deleteFamilyHistoryProblems,
  getMostUsedFamilyProblems,

  createDrugHistory,
  getAllDrugHistory,
  updateDrugHistory,
  deleteDrugHistoryById,
  GetMostUsedDrugHistory,

  createDrugAllergy,
  getAllDrugAllergy,
  updateDrugAllergyById,
  deleteDrugAllergyByIds,
  GetMostUsedDrugAllergy,

  createFoodAllergy,
  getAllFoodAllergy,
  updateFoodAllergyById,
  deleteFoodAllergyByIds,
  GetMostUsedFoodAllergy,

  createGeneralAllergy,
  getAllGeneralAllergy,
  updateGeneralAllergyById,
  deleteGeneralAllergyByIds,
  GetMostUsedGeneralAllergy,

  createFamilyMember,
  getAllFamilyMember,
  GetMostUsedFamilyMember,
  deleteFamilyMember,

  createLifeStyle,
  getAllLifeStyle,
  updateLifeStyleById,
  deleteLifeStyleByIds,
  GetMostUsedLifeStyle,
  updateObjectiveLifeStyle,
  editLifeStyleObjectiveInnerDataEntry,
  deleteLifeStyleObjectiveInnerDataEntriesByIndex,
  deleteLifeStyleInnerObjectiveDataEntries,
  deleteLifeStyleObjectiveEntriesByIndex,
  updateLifeStyleObjectiveEntryByIndex,
  updateObjectiveLayer,
  updateSubjectiveLifestyleById,
  addLayer2SubjectiveLifestyle,
  addLayer3SubjectiveLifestyle,
  GetpersonalHistorybypatientId,
  addPersnalHistory,
  deletelifeStylePersonalHistory,

  deleteGynacHistoryFormHistory,
  deleteGynacObjectiveEntriesByIndex,
  deleteGynacInnerObjectiveDataEntries,
  deleteGynacObjectiveInnerDataEntriesByIndex,
  editGynacObjectiveInnerDataEntry,
  updateObjectiveGynac,
  createGynacHistory,
  getAllGynacHistory,
  updateSubjectiveGynacHistoryById,
  addLayer2SubjectiveGynacHistory,
  addLayer3SubjectiveGynac,
  updateGynacHistoryById,
  updateObjectiveLayerForGynacHistory,
  updateGynacHistoryByIdForLastLayer,
  addGynacHistoryForPatient,
  getGynacHistoryByPatientId,
  deleteGynacHistoryByIds,
  GetMostUsedGynacHistory,
  updateGynacObjectiveEntryByIndex,

  deleteObstetricHistoryFormHistory,
  updateObstetricHistoryObjectiveEntryByIndex,
  deleteObstetricHistoryObjectiveInnerDataEntriesByIndex,
  deleteObstetricHistoryInnerObjectiveDataEntries,
  editObstetricHistoryObjectiveInnerDataEntry,
  deleteObstetricHistoryInnerObjectiveDataEntries,
  addLayer3SubjectiveObstetricHistory,
  addLayer2SubjectiveObstetricHistory,
  updateSubjectiveObstetricHistoryById,
  deleteObstetricHistoryObjectiveEntriesByIndex,
  GetObstetricHistorybypatientId,
  addObstetricHistoryHistory,
  updateObstetricHistoryByIdForLastLayer,
  updateObjectiveLayerObstetricHistory,

  createObstetricHistory,
  getAllObstetricHistory,
  GetMostUsedObstetricHistory,
  updateObstetricHistoryById,
  deleteObstetricHistoryByIds,
  updateObjectiveObstetricHistory,

  addObstetricHistoryHistoryByPatientId,
  updatePainChiefComplaintAll,

  deleteHistoryFormHistoryController,
  deleteOtherObjectiveEntriesByIndex,
  deleteOtherInnerObjectiveDataEntries,
  deleteOtherObjectiveInnerDataEntriesByIndex,
  editOtherObjectiveInnerDataEntry,
  updateOtherObjectiveEntryByIndex,
  updateObjectiveOther,
  createOtherHistory,
  getAllOtherHistory,
  updateSubjectiveOtherHistoryById,
  addLayer2SubjectiveOtherHistory,
  addLayer3SubjectiveOthers,
  updateOtherHistoryById,
  updateObjectiveLayerForOtherHistory,
  updateOtherHistoryByIdForLastLayer,
  addOtherHistoryForPatient,
  getOtherHistoryByPatientId,
  deleteOtherHistoryByIds,
  GetMostUsedOtherHistory,

  deleteNutritionalHistoryFormHistory,
  deleteNutritionalObjectiveEntriesByIndex,
  deleteNutritionalInnerObjectiveDataEntries,
  deleteNutritionalObjectiveInnerDataEntriesByIndex,
  editNutritionalObjectiveInnerDataEntry,
  updateNutritionalObjectiveEntryByIndex,
  updateObjectiveNutritional,
  createNutritionalHistory,
  getAllNutritionalHistory,
  updateSubjectiveNutritionalHistoryById,
  addLayer2SubjectiveNutritionalHistory,
  addLayer3SubjectiveNutritional,
  updateNutritionalHistoryById,
  updateObjectiveLayerForNutritionalHistory,
  updateNutritionalHistoryByIdForLastLayer,
  addNutritionalHistoryForPatient,
  getNutritionalHistoryByPatientId,
  deleteNutritionalHistoryByIds,
  GetMostUsedNutritionalHistory,

  deletePediatricHistoryFormHistory,
  deletePediatricObjectiveEntriesByIndex,
  deletePediatricInnerObjectiveDataEntries,
  deletePediatricObjectiveInnerDataEntriesByIndex,
  editPediatricObjectiveInnerDataEntry,
  updatePediatricObjectiveEntryByIndex,
  updateObjectivePediatric,
  createPediatricHistory,
  getAllPediatricHistory,
  updateSubjectivePediatricHistoryById,
  addLayer2SubjectivePediatricHistory,
  addLayer3SubjectivePediatric,
  updatePediatricHistoryById,
  updateObjectiveLayerForPediatricHistory,
  updatePediatricHistoryByIdForLastLayer,
  addPediatricHistoryForPatient,
  getPediatricHistoryByPatientId,
  deletePediatricHistoryByIds,
  GetMostUsedPediatricHistory,

  createProcedure,
  getAllProcedure,
  updateProcedureById,
  deleteProcedureByIds,
  GetMostUsedProcedure,

  createInstruction,
  getAllInstruction,
  updateInstructionById,
  deleteInstructionByIds,
  GetMostInstruction,

  createAdvice,
  getAllAdvice,
  editAdvice,
  deleteAdvice,

  createChiefComplaint,
  getAllChiefComplaint,
  updateCheifcomplaint,
  updateDescriptionCheifcomplaint,
  updateRelevingFactors,
  updateSinceCheifcomplaint,
  updatePainDuration,
  updateTreatmentCheifcomplaint,
  updateLocationCheifcomplaint,
  GetMostCheifcomplaint,
  updateQualityPain,
  updateNatureOfPain,
  updateAggregatingFactors,
  updatePainLocationCheifcomplaint,
  updateCheifcomplaintById,
  deleteCheifcomplaintByIds,
  deleteSingleChiefComplaint,
  createPainChiefComplaint,
  getAllPainChiefComplaint,
  deleteSinglePainChiefComplaint,

  createPresentIllnessHistory,
  getAllPresentIllnessHistory,
  updateObjectivePresentIllnessHistory,
  updatePresentIllnessHistory,
  deletePresentIllnessHistoryByIds,
  GetMostPresentIllnessHistory,

  createProvisionalDiagnosis,
  getAllProvisionalDiagnosis,
  updateProvisionalDiagnosisById,
  deleteProvisionalDiagnosisByIds,
  GetMostProvisionalDiagnosis,
  importJson,

  createFinalDiagnosis,
  getAllFinalDiagnosis,
  updateFinalDiagnosisById,
  deleteFinalDiagnosisByIds,
  GetMostFinalDiagnosis,

  createRiskFactor,
  getAllRiskFactor,
  GetMostRiskFactor,

  getOpdMenu,
  updatedOPDMenu,

  updateDiagramInLocalExamination,
  updateDiagramInLocalExaminationDelete,
  createLocalExamination,
  getAllLocalExamination,
  addNestedObjectiveForLocal,
  addNestedObjectiveForSystemic,
  updateLocalExamination,
  updateLocalExaminationById,
  deleteLocalExaminationByIds,
  GetMostUsedLocalExamination,
  deleteLocalExaminationSubDisorderByIds,
  updateLocalExaminationSubDisorderById,
  addMostNestedObjectiveForLocal,
  examinationAddObjectiveOptionForLocal,
  examinationAddObjectiveOptionForSystemic,

  editExaminationInnerDataEntry,
  editExaminationObjectiveDataLayer3,
  deleteExaminationInnerDataEntriesByIndex,
  deleteExaminationObjectives,
  editExaminationDiagram,
  createGeneralExamination,
  getAllGeneralExamination,
  updateGeneralExamination,
  addNestedObjective,
  addMostNestedObjective,
  updateGeneralExaminationById,
  deleteGeneralExaminationByIds,
  GetMostUsedGeneralExamination,
  deleteGeneralExaminationSubDisorderByIds,
  updateGeneralExaminationSubDisorderById,
  deleteExaminationObjectivesfromFirstLayer,
  examinationAddObjectiveOption,

  createSystematicExamination,
  getAllSystematicExamination,
  updateSystematicExamination,
  updateAllSystematicExamination,
  updateDiagramInSystematicExamination,
  deleteSystematicExaminationByIds,
  GetMostUsedSystematicExamination,
  deleteSystematicExaminationSubDisorderByIds,
  updateSystematicExaminationSubDisorderById,
  updateDiagramInSystematicExaminationDelete,
  addMostNestedObjectiveForSystemic,

  createOtherExamination,
  getAllOtherExamination,
  updateOtherExaminationById,
  deleteOtherExaminationByIds,
  GetMostUsedOtherExamination,

  GetMostUsedSurgeryPackage,

  GetMostUsedRadiologyInvest,
  GetMostUsedPathologyInvest,

  getAllPatientData,
  getAllPatientdataToPrint,
  getPatientsHistoryByUHID,

  createOPDBilling,
  getOPDBilling,
  getMostUsedServiceDetails,

  getPatientCountByConsultant,
  updateLifeStyleByIdForLastLayer,
  deleteHistoryFromMedicalHistory,
};
