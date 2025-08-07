module.exports.adminController = require('./admin.controller')
module.exports.companyController = require('./companySetup.controller')
module.exports.departmentController = require('./departmentSetup.controller')
module.exports.pincodeController = require('./pincode.controller')
module.exports.superAdminController = require('./superAdmin.controller')
// Chat
module.exports.chatController = require('./Chat/chat.controller')

//Manage Room
module.exports.roomTypeController = require('./Manage Room/roomType.controller')
module.exports.bedMasterController = require('./Manage Room/bedMaster.controller')
module.exports.rateMasterController = require('./Manage Room/rateMaster.controller')

//Masters
module.exports.appointmentSchedulingController = require('./Masters/appointment.controller')
module.exports.billGroupController = require('./Masters/billGroup.controller')
module.exports.designationController = require('./Masters/designation.controller')
module.exports.outsourceDiagnosticontroller = require('./Masters/outsourceDiagnostic.controller')
module.exports.partyMasterController = require('./Masters/partyMaster.controller')
module.exports.productMasterController = require('./Masters/productMaster.controller')
module.exports.storeController = require('./Masters/store.controller')
module.exports.serviceDetailsController = require('./Masters/serviceDetailsMaster.controller')
module.exports.OPDPackagesController = require('./Masters/opd_package.controller')
module.exports.surgeryPackageController = require('./Masters/surgeryPackageMaster.controller')
module.exports.OtMasterController = require('./Masters/otMaster.controller')
module.exports.UHID_MRN_NAME_Controller = require('./Masters/uhid_mrn_name.controller')
module.exports.PaymentModeController = require('./Masters/payment_mode.controller')
module.exports.EmployeeRoleController = require('./Masters/employee_role.controller')
module.exports.VitalsMasterController = require('./Masters/vitals.controller')
module.exports.MedicinesMasterController = require('./Masters/medicines.controller')
module.exports.LegderMasterController = require('./Masters/ledger.controller')
module.exports.InsuranceCompanyController = require('./Masters/insurance_company.controller')
module.exports.TemplateSectionController=require('./Template/templateSection.controller')

//hr setup controller
module.exports.diplomaController = require('./Masters/hr-setup/diploma.controller')
module.exports.graduationController = require('./Masters/hr-setup/graduation.controller')
module.exports.postGraduationController = require('./Masters/hr-setup/postGraduation.controller')
module.exports.superSpecializationController = require('./Masters/hr-setup/superSpecialization.controller')
module.exports.listOfCouncilsController = require('./Masters/hr-setup/listOfCouncil.controller')
module.exports.typeOfLeaveController = require('./Masters/hr-setup/typeOfLeave.controller')
module.exports.leaveManagerController = require("./Masters/hr-setup/leaveManager.controller")
module.exports.dearnessAllowanceController = require('./Masters/hr-setup/dearnessAllowance.controller')
module.exports.hraAllowanceController = require('./Masters/hr-setup/hraAllowance.controller')
module.exports.otherAllowanceController=require('./Masters/hr-setup/otherAllowances.controller')
module.exports.entryController=require("./Masters/hr-setup/entry.controller")
module.exports.charityController=require("./Masters/charity.controller")

//Pathology
module.exports.InvestigationPathologyMasterController = require('./Masters/Pathology_Master/investigationRadiologyMaster.controller')
module.exports.machineController = require('./Masters/Pathology_Master/machineMaster.controller')
module.exports.specimenController = require('./Masters/Pathology_Master/specimen.controller')
module.exports.unitController = require('./Masters/Pathology_Master/unitMaster.controller')
module.exports.TemplateSheetController=require('./ipd-form-setup/treatmentSheet.controller')
module.exports.InitialPainAssessmentController=require('./ipd-form-setup/InitialPainAssessment.controller')
module.exports.RectangularBoxesController=require("./ipd-form-setup/rectangularBoxes.controller")
module.exports.ChipController=require("./ipd-form-setup/chip.controller");
//Radiology
module.exports.InvestigationRadiologyMasterController = require('./Masters/Radiology_Master/investigationRadiologyMaster.controller')
module.exports.machineRadiologyMasterController = require('./Masters/Radiology_Master/machineRadiologyMaster.controller')
module.exports.specimenRadiologyMasterController = require('./Masters/Radiology_Master/specimenRadiologyMaster.controller')
module.exports.unitRadiologyController = require('./Masters/Radiology_Master/unitRadiologyMaster.controller')

//Staffs
module.exports.consultantController = require('./Satffs/consultants/consultants.controller') //old consultant controller
module.exports.employeeController = require('./Satffs/employee/employeee.controller')

//newStaffApis

module.exports.AdministrativeController = require('./Satffs/administrative/administrative.controller')
module.exports.SupportController = require('./Satffs/support/support.controller')
module.exports.NursingAndParamedicalController = require('./Satffs/nursingAndParamedical/nursinigAndParamedical.controller')
module.exports.MedicalOfficerController = require('./Satffs/medicalOfficer/medicalOfficer.controller')
module.exports.ConsultantsController = require('./Satffs/consultant/consultant.controller') //new consultant controller


//Patient
module.exports.patientController = require('./Patient/patient.controller')
module.exports.bookappointmentController = require('./Patient/bookappointment.controller')
module.exports.confirmappointmentController = require('./Patient/confirmappointment.controller')

// OPD
module.exports.opdController = require('./OPD/opd.controller')

// OPD/Patient
module.exports.PatientHistoryController = require('./OPD/Patient/patient_history.controller')
module.exports.PatientChiefComplaintController = require('./OPD/Patient/patient_chief_complaint.controller')
module.exports.PatientPresentIllnessController = require('./OPD/Patient/patient_present_illness.controller')
module.exports.PatientProvisionalDiagnosisController = require('./OPD/Patient/patient_provisional_diagnosis.controller')
module.exports.PatientFinalDiagnosisController = require('./OPD/Patient/patient_final_diagnosis.controller')
module.exports.PatientProcedureController = require('./OPD/Patient/patient_procedure.controller')
module.exports.PatientGlassPrescriptionController = require('./OPD/Patient/patient_glass_prescription.controller')
module.exports.PatientMedicalPrescriptionController = require('./OPD/Patient/patient_medical_prescription.controller')
module.exports.PatientFollowUpController = require('./OPD/Patient/patient_followup.controller')
module.exports.PatientLabRadiologyController = require('./OPD/Patient/patient_lab_radiology.controller')
module.exports.PatientInstructionController = require('./OPD/Patient/patient_instruction.controller')
module.exports.PatientVitalsController = require('./OPD/Patient/patient_vitals.controller')
module.exports.PatientExaminationController = require('./OPD/Patient/patient_examination.controller')

module.exports.OPDReciptController = require('./OPDBillReceipts/OPDBillReceipt.controller')

//Emergency/Patient
module.exports.EmergencyPatientVitalsController = require('./Emergency/Patient/emergency_patient_vitals.controller')
module.exports.EmergencyPatientChiefComplaintController = require('./Emergency/Patient/emergency_chief_complaint.controller')

// Prefix
module.exports.prefixController = require('./Masters/prefixMaster.controller')

// Prefix
module.exports.refferByController = require('./Masters/refferByMaster.controller')

//Category
module.exports.categoryController = require('./Masters/category.controller')
