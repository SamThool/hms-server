const express = require("express");

const adminRoute = require("./admin.route");
const pincodeRoute = require("./pincode.route");
const ipdFormSetup = require("./ipd-form-setup/ipdFormSetup.routes");
const initialPainAsessment = require("./ipd-form-setup/initialPainAssessment.routes");
const NurseAssessmentRouter = require("./ipd-form-setup/NurseInitialAssessment/nurseAssessment.routes");
const rectangularBoxes = require("./ipd-form-setup/rectangularBoxes.routes");
const chipRouter = require("./ipd-form-setup/chip.routes");
const templateSheetRoute = require("./ipd-form-setup/ipdFormSetup.routes");
const CarePlanRouter = require("./ipd-form-setup/carePlan.routes");
const TemplateReport = require("./Template/templateReport.route");
// const TemplatePathology = require("./Template/templatePathology.route");
const chatRoute = require("./Chat/chat.route");
const designationRoute = require("./Masters/designation.route");
const companySetupRoute = require("./companySetup.route");
const departmentRoute = require("./departmentSetup.route");
const billGroupRoute = require("./Masters/billGroup.route");
const storeRoute = require("./Masters/store.route");
const serviceDetailsRoute = require("./Masters/serviceDetails.route");
const OPDPackageRoute = require("./Masters/opd-package.route");
const opdConsultantServiceRouter = require("./Masters/opdConsultantService.route");
const notificationRouter = require("./Notification/Notification");
const translateRouter = require("./translate.route");

const surgeryPackageRoute = require("./Masters/surgeryPackage.route");
const charityMasterRoute = require("./Masters/charity.route");
const roomTypeRoute = require("./Manage Room/roomType.route");
const bedMasterRoute = require("./Manage Room/bedMaster.route");
const rateMasterRoute = require("./Manage Room/rateMaste.route");
const otMasterRoute = require("./Masters/otMaster.route");
const outsourceDiagnosticRoute = require("./Masters/outsourceDiagnostic.route");
const partyMasterRoute = require("./Masters/partyMaster.route");
const productMasterRoute = require("./Masters/productMaster.route");
const UHID_MRN_NAMERouter = require("./Masters/uhid_mrn_name.route");
const paymentModeRouter = require("./Masters/payment_mode.route");
const employeeRoleRouter = require("./Masters/employee_role.route");
const vitalsMasterRouter = require("./Masters/vitals.route");
const unitMasterRouter = require("./Masters/clinical-setup/unit-master/unitMaster.route");
const ageGroupMasterRouter = require("./Masters/clinical-setup/age-group-master/ageGroup.route");
const vitalMaster = require("./Masters/clinical-setup/vitals-master/vital.route");

const ledgerRouter = require("./Masters/ladger.route");
const insuranceCompanyRouter = require("./Masters/insurance_company.route");
const gipsaaCompanyRouter = require("./Masters/gipsaa_company.route");
const visionOptionRouter = require("./OPD/Examination/opthalmology/visionOption");
const findingOptionRouter = require("./OPD/Examination/opthalmology/findingOption");
const dilatedOptionRouter = require("./OPD/Examination/opthalmology/arUndilated");
const unDilatedOptionRouter = require("./OPD/Examination/opthalmology/arDilated");

const medicinesMasterRouter = require("./Masters/medicines.route");
const unitMasterRoute = require("./Masters/Pathology_Master/unitMaster.route");
const unitRadiologyMasterRoute = require("./Masters/Radiology_Master/unitRadiology.route");
const specimenMasterRoute = require("./Masters/Pathology_Master/specimenMaster.route");
const specimenRadiologyMasterRoute = require("./Masters/Radiology_Master/specimenRadiologyMaster.route");
const machineMasterRoute = require("./Masters/Pathology_Master/machineMaster.route");
const investigationPathologyMasterRoute = require("./Masters/Pathology_Master/investigationRadiologyMaster.route");
const servicePathologyRate = require("./Masters/Pathology_Master/serviceRatePathology");
const appointmentSchedulingRoute = require("./Masters/appointment.route");
const machineRadiologyMasterRoute = require("./Masters/Radiology_Master/machineRadiologyMaster.route");
const otherDiagnosticsMachineRoute = require("./Masters/OtherDiagnostics/MachineMaster.route");
const investigationRadiologyMasterRoute = require("./Masters/Radiology_Master/investigationRadiologyMaster.route");
const OtherDiagnostics = require("./Masters/OtherDiagnostics/OtherDiagnostics.route");
const ProcedureRoute = require("./Masters/ProcedureMaster/Procedure.route");
const consultantRoute = require("./Staffs/consultant/consultant.route");
const employeeRoute = require("./Staffs/employee/employee.route");

//hr setup
const diplomaRouter = require("./Masters/hr-setup/diploma.route");
const graduationRoute = require("./Masters/hr-setup/graduation.route");
const postGraduationRoute = require("./Masters/hr-setup/postGraduation.route");
const superSpecialization = require("./Masters/hr-setup/superSpecialization.route");
const listOfCouncilsRoute = require("./Masters/hr-setup/listOfCouncils.route");
const typeOfLeaveRoute = require("./Masters/hr-setup/typeOfLeave.route");
const leaveManagerRoute = require("./Masters/hr-setup/leaveManager.route");
const dearnessAllowanceRoute = require("./Masters/hr-setup/dearnessAllowance.route");
const hraAllowanceRoute = require("./Masters/hr-setup/hraAllowance.route");
const PTRouter = require("./Masters/hr-setup/pt.route");
const IncomeRouter = require("./Masters/hr-setup/income.route");
const administrativeRoute = require("./Staffs/administrative/administrative.route");
const support = require("./Staffs/support/support.route");
const nursingAndParamedicalRoute = require("./Staffs/nursingAndParamedical/nursingAndParamedical.route");
const medicalOfficerRoute = require("./Staffs/medicalOfficer/medicalOfficer.route");
const newConsultantRoute = require("./Staffs/newConsultant/newConsultant.route");

const patientRoute = require("./Patient/patient.route");
const opdRoute = require("./OPD/opd.route");
const opdBillingRouter = require("./OPDBilling/OPDBillingRoute");
// OPD Patient Starts
const PatientHistoryRoute = require("./OPD/Patient/patient_history.route");
const PatientChiefComplaintRoute = require("./OPD/Patient/patient_chief_complaint.route");
const PatientOpthelmicRoute = require("./OPD/Patient/patient_opthelmic.route");
const PainPatientChiefComplaintRoute = require("./OPD/Patient/pain_chiefComplaintRoute");
const PatientPresentIllnessRoute = require("./OPD/Patient/patient_present_illness.route");
const PatientProvisionalDiagnosisRoute = require("./OPD/Patient/patient_provisional_diagnosis.route");
const PatientFinalDiagnosisRoute = require("./OPD/Patient/patient_final_diagnosis.route");
const PatientProcedureRoute = require("./OPD/Patient/patient_procedure.route");
const PatientDiagnosticsRoutes = require("./OPD/Patient/patient_diagnostics.route");
const PatientPathologyRoute = require("./OPD/Patient/patient_pathology");
const PatientRadiologyRoute = require("./OPD/Patient/patient_radiology");
const PatientLabRadiologyRoute = require("./OPD/Patient/patient_lab_radiology.route");
const PatientInstructionRoute = require("./OPD/Patient/patient_instruction.route");
const PatientVitalsRoute = require("./OPD/Patient/patient_vitals.route");
const PatientExaminationRoute = require("./OPD/Patient/patient_examination.route");
const PatientGlassPrescriptionRoute = require("./OPD/Patient/patient_glasss_prescription.route");
const PatientMedicalPrescriptionRoute = require("./OPD/Patient/patient_medical_prescription.route");
const PatientFollowUpRoute = require("./OPD/Patient/patient_followup.route");

const OPDReceiptRoute = require("./OPDBillReceipts/OPDBillReceipt.route");
// OPD Patient Ends
const bookappointmentRoute = require("./Patient/bookappointment.route");
const confirmappointmentRoute = require("./Patient/confirmappointment.route");
const prefixRoute = require("./Masters/prefixMaster.route");
const subDepartmentRoute = require("./Masters/subDepartment/Subdepartment");
const refferByRoute = require("./Masters/refferBy.route");
const categoryRoute = require("./Masters/category.route");
const EntryRouter = require("./Masters/hr-setup/entry.route");
const OtherAllowancesRouter = require("./Masters/hr-setup/otherAllowance.route");

//emergency
const EmergencyRouter = require("./Emergency/emergencyRegestration.route");
const EmergencyPatientVitalsRouter = require("./Emergency/Patient/emergency_patient_vitals.route");
const EmergencyPatientProvisionalDiagnosisRoutes = require("./Emergency/Patient/emergency_patient_provisional_diagnosis.route");
const EmergencyPatientChiefComplaintRouter = require("./Emergency/Patient/emergency_patient_chief_complaint.route");
const EmergencyPatientFinalDiagnosisRoutes = require("./Emergency/Patient/emergency_patient_finalDiagnosis.route");
const EmergencyPatientMedicalPrescriptionRoutes = require("./Emergency/Patient/emergency_patient_medical_prescription.route");
const EmergencyPatientProcedureRoutes = require("./Emergency/Patient/emergency_patient_procedure.route");
const EmergencyPatientInstructionRoutes = require("./Emergency/Patient/emergency_patient_instruction.route");
const EmergencyPatientFollowUpRoutes = require("./Emergency/Patient/emergency_patient_followUp.route");
const departmentTypeRouter = require("./departmentType.route");
const departmentSubTypeRouter = require("./departmentSubType.route");

const TypeRouter = require("./Masters/medicine/typeRoutes");
const genericRoutes = require("./Masters/medicine/genericRoute");
const routeRoute = require("./Masters/medicine/routeRoutes");
const categoryMasterRoutes = require("./Masters/medicine/categoryRoute");
const doseMasterRoutes = require("./Masters/medicine/doseRoute");
const brandMasterRoutes = require("./Masters/medicine/brandRoutes");

const TimeIntervalMasterRouter = require("./Masters/timeInterval.route");
const RoomCategoryMaster = require("./Masters/../Manage Room/category.route");
const RoomNoMaster = require("./Masters/../Manage Room/roomNo.route");
const PatientAppointRouter = require("./Masters/patientAppointment.route");
const ServiceRateRouter = require("./Masters/serviceRate.route");
const ServiceRateRouterNew = require("./Masters/serviceRateNew.route");
const IPDPatientRouter = require("./appointment-confirm/ipdPatient.controller");
const DaycarePatientRouter = require("./appointment-confirm/daycarePatient.controller");
const WalkinPatientRouter = require("./appointment-confirm/walkinPatient.controller");
const OPDPatientRouter = require("./appointment-confirm/opdPatient.route");
const OPDCertificateRouter = require("./OPD/OPDCertificate/OPDCertificate.route");
const OPDRefundNoteRouter = require("./OPDBilling/OPDRefundNote.route");
const OPDDiscountNoteRouter = require("./OPDBilling/OPDDiscountNote.route");
const EmrPatientRouter = require("./appointment-confirm/emrPatient.controller");
const walkinRoute = require("./Walkin/walkin.route");
const FormSetupRouter = require("./Masters/formSetup.routes");
const SinceRouter = require("./OPD/since.route");
const TemplateSectionRouter = require("./Template/templateSection.route");
const formSetupVitalsMaster = require("./Masters/formSetup/formSetupVitalMaster.route");
const crossConsultationRoute = require("./OPD/Patient/patient_cross_consultation.route");
const ParameterMasterRouter = require("./Masters/Pathology_Master/parameterMaster.route");
const router = express.Router();

const defaultRoutes = [
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/chat",
    route: chatRoute,
  },
  {
    path: "/company-setup",
    route: companySetupRoute,
  },
  {
    path: "/department-setup",
    route: departmentRoute,
  },
  {
    path: "/department-type",
    route: departmentTypeRouter,
  },
  {
    path: "/department-sub-type",
    route: departmentSubTypeRouter,
  },
  {
    path: "/pincodes",
    route: pincodeRoute,
  },
  {
    path: "/designation-master",
    route: designationRoute,
  },
  {
    path: "/billgroup-master",
    route: billGroupRoute,
  },
  {
    path: "/initial-pain-assessment",
    route: initialPainAsessment,
  },
  {
    path: "/initial-pain-assessment/boxes",
    route: rectangularBoxes,
  },
  {
    path: "/initial-pain-assessment/chips",
    route: chipRouter,
  },
  {
    path: "/initial-nurse-assessment",
    route: NurseAssessmentRouter,
  },
  {
    path: "/store-master",
    route: storeRoute,
  },
  {
    path: "/service-details-master",
    route: serviceDetailsRoute,
  },
  {
    path: "/opd-package",
    route: OPDPackageRoute,
  },
  {
    path: "/opd-consultant-service",
    route: opdConsultantServiceRouter,
  },
  {
    path: "/surgery-package-master",
    route: surgeryPackageRoute,
  },
  {
    path: "/outsourceDiagnostic-master",
    route: outsourceDiagnosticRoute,
  },
  {
    path: "/party-master",
    route: partyMasterRoute,
  },
  {
    path: "/product-master",
    route: productMasterRoute,
  },
  {
    path: "/unit-pathology-master",
    route: unitMasterRoute,
  },
  {
    path: "/unit-radiology-master",
    route: unitRadiologyMasterRoute,
  },
  {
    path: "/specimen-pathology-master",
    route: specimenMasterRoute,
  },
  {
    path: "/specimen-radiology-master",
    route: specimenRadiologyMasterRoute,
  },
  {
    path: "/machine-pathology-master",
    route: machineMasterRoute,
  },
  {
    path: "/machine-radiology-master",
    route: machineRadiologyMasterRoute,
  },
  {
    path: "/other-diagnostics-machine-master",
    route: otherDiagnosticsMachineRoute,
  },
  {
    path: "/investigation-radiology-master",
    route: investigationRadiologyMasterRoute,
  },
  {
    path: "/other-diagnostics-master",
    route: OtherDiagnostics,
  },
  {
    path: "/procedure-master",
    route: ProcedureRoute,
  },
  {
    path: "/investigation-pathology-master",
    route: investigationPathologyMasterRoute,
  },
  {
    path: "/investigation-pathology-service-rate",
    route: servicePathologyRate,
  },
  {
    path: "/appointmentSchedule-master",
    route: appointmentSchedulingRoute,
  },
  {
    path: "/room-category",
    route: RoomCategoryMaster,
  },
  {
    path: "/room-no",
    route: RoomNoMaster,
  },
  {
    path: "/room-type",
    route: roomTypeRoute,
  },
  {
    path: "/bed-master",
    route: bedMasterRoute,
  },
  {
    path: "/rate-master",
    route: rateMasterRoute,
  },
  {
    path: "/translate",
    route: translateRouter,
  },

  {
    path: "/diploma",
    route: diplomaRouter,
  },

  {
    path: "/graduation",
    route: graduationRoute,
  },

  {
    path: "/postGraduation",
    route: postGraduationRoute,
  },

  {
    path: "/superSpecialization",
    route: superSpecialization,
  },

  {
    path: "/listOfCouncils",
    route: listOfCouncilsRoute,
  },
  {
    path: "/typeOfLeave",
    route: typeOfLeaveRoute,
  },
  {
    path: "/leaveManager",
    route: leaveManagerRoute,
  },
  {
    path: "/dearnessAllowance",
    route: dearnessAllowanceRoute,
  },
  {
    path: "/hraAllowance",
    route: hraAllowanceRoute,
  },

  {
    path: "/consultant",
    route: consultantRoute,
  },
  {
    path: "/employee",
    route: employeeRoute,
  },

  {
    path: "/administrative",
    route: administrativeRoute,
  },

  {
    path: "/support",
    route: support,
  },

  {
    path: "/nursingAndParamedical",
    route: nursingAndParamedicalRoute,
  },

  {
    path: "/medicalOfficer",
    route: medicalOfficerRoute,
  },

  {
    path: "/newConsultant",
    route: newConsultantRoute,
  },

  {
    path: "/patient",
    route: patientRoute,
  },
  {
    path: "/opd",
    route: opdRoute,
  },
  {
    path: "/opd-billing",
    route: opdBillingRouter,
  },
  {
    path: "/opd-refundNote",
    route: OPDRefundNoteRouter,
  },
  {
    path: "/opd-discountNote",
    route: OPDDiscountNoteRouter,
  },
  {
    path: "/notification",
    route: notificationRouter,
  },
  {
    path: "/uhid",
    route: UHID_MRN_NAMERouter,
  },
  {
    path: "/payment-mode",
    route: paymentModeRouter,
  },
  {
    path: "/employee-role",
    route: employeeRoleRouter,
  },
  {
    path: "/vitals",
    route: vitalsMasterRouter,
  },
  {
    path: "/clinical-setup",
    route: unitMasterRouter,
  },
  {
    path: "/parameters",
    route: ParameterMasterRouter,
  },
  {
    path: "/age-group",
    route: ageGroupMasterRouter,
  },
  {
    path: "/vital-master",
    route: vitalMaster,
  },

  {
    path: "/category-master",
    route: categoryMasterRoutes,
  },
  {
    path: "/generic-master",
    route: genericRoutes,
  },
  {
    path: "/route-master",
    route: routeRoute,
  },
  {
    path: "/type-master",
    route: TypeRouter,
  },
  {
    path: "/template-sheet",
    route: templateSheetRoute,
  },
  {
    path: "/dose-master",
    route: doseMasterRoutes,
  },
  {
    path: "/brand-master",
    route: brandMasterRoutes,
  },
  {
    path: "/medicines",
    route: medicinesMasterRouter,
  },
  {
    path: "/since-master",
    route: SinceRouter,
  },
  {
    path: "/ledger",
    route: ledgerRouter,
  },
  {
    path: "/insurance-company",
    route: insuranceCompanyRouter,
  },
  {
    path: "/gipsaa-company",
    route: gipsaaCompanyRouter,
  },
  {
    path: "/vision-options",
    route: visionOptionRouter,
  },
  {
    path: "/finding-options",
    route: findingOptionRouter,
  },
  {
    path: "/ar-options-dilated",
    route: unDilatedOptionRouter,
  },
  {
    path: "/ar-options-undilated",
    route: dilatedOptionRouter,
  },
  // OPD/Patient Start
  {
    path: "/patient-history",
    route: PatientHistoryRoute,
  },
  {
    path: "/patient-chief-complaint",
    route: PatientChiefComplaintRoute,
  },
  {
    path: "/patient-opthelmic",
    route: PatientOpthelmicRoute,
  },
  {
    path: "/pain-patient-chief-complaint",
    route: PainPatientChiefComplaintRoute,
  },
  {
    path: "/patient-present-illness",
    route: PatientPresentIllnessRoute,
  },
  {
    path: "/patient-provisional-diagnosis",
    route: PatientProvisionalDiagnosisRoute,
  },
  {
    path: "/patient-final-diagnosis",
    route: PatientFinalDiagnosisRoute,
  },
  {
    path: "/patient-procedure",
    route: PatientProcedureRoute,
  },
  {
    path: "/patient-cross-consultation",
    route: crossConsultationRoute,
  },
  {
    path: "/patient-diagnostics",
    route: PatientDiagnosticsRoutes,
  },
  {
    path: "/patient-pathology",
    route: PatientPathologyRoute,
  },
  {
    path: "/patient-radiology",
    route: PatientRadiologyRoute,
  },
  {
    path: "/patient-lab-radiology",
    route: PatientLabRadiologyRoute,
  },
  {
    path: "/patient-instruction",
    route: PatientInstructionRoute,
  },
  {
    path: "/patient-vital",
    route: PatientVitalsRoute,
  },
  {
    path: "/patient-examination",
    route: PatientExaminationRoute,
  },
  {
    path: "/patient-glass-prescription",
    route: PatientGlassPrescriptionRoute,
  },
  {
    path: "/patient-medical-prescription",
    route: PatientMedicalPrescriptionRoute,
  },
  {
    path: "/patient-followup",
    route: PatientFollowUpRoute,
  },

  {
    path: "/opd-receipt",
    route: OPDReceiptRoute,
  },

  // OPD/Patient Ends
  {
    path: "/book-appointment",
    route: bookappointmentRoute,
  },
  {
    path: "/confirm-appointment",
    route: confirmappointmentRoute,
  },
  {
    path: "/prefix",
    route: prefixRoute,
  },
  {
    path: "/sub-department",
    route: subDepartmentRoute,
  },
  {
    path: "/refferBy",
    route: refferByRoute,
  },
  {
    path: "/category",
    route: categoryRoute,
  },
  {
    path: "/ot-master",
    route: otMasterRoute,
  },
  {
    path: "/emergency_patient_registration",
    route: EmergencyRouter,
  },

  {
    path: "/emergency-patient-vitals",
    route: EmergencyPatientVitalsRouter,
  },

  {
    path: "/emergency-patient-chief-complaint",
    route: EmergencyPatientChiefComplaintRouter,
  },

  {
    path: "/walkin",
    route: walkinRoute,
  },
  {
    path: "/emergency-patient-provisional-diagnosis",
    route: EmergencyPatientProvisionalDiagnosisRoutes,
  },
  {
    path: "/emergency-patient-final-diagnosis",
    route: EmergencyPatientFinalDiagnosisRoutes,
  },
  {
    path: "/emergency-patientMedical-prescription",
    route: EmergencyPatientMedicalPrescriptionRoutes,
  },
  {
    path: "/emergency-patient-procedure",
    route: EmergencyPatientProcedureRoutes,
  },
  {
    path: "/emergency-patient-instruction",
    route: EmergencyPatientInstructionRoutes,
  },
  {
    path: "/emergency-patient-followUp",
    route: EmergencyPatientFollowUpRoutes,
  },
  {
    path: "/time-interval",
    route: TimeIntervalMasterRouter,
  },
  {
    path: "/patient-appointment",
    route: PatientAppointRouter,
  },
  {
    path: "/service-rate",
    route: ServiceRateRouter,
  },
  {
    path: "/service-rate-new",
    route: ServiceRateRouterNew,
  },
  {
    path: "/opd-patient",
    route: OPDPatientRouter,
  },
  {
    path: "/opd-certificate",
    route: OPDCertificateRouter,
  },
  {
    path: "/ipd-patient",
    route: IPDPatientRouter,
  },
  {
    path: "/walkin-patient",
    route: WalkinPatientRouter,
  },
  {
    path: "/daycare-patient",
    route: DaycarePatientRouter,
  },
  {
    path: "/emr-patient",
    route: EmrPatientRouter,
  },
  {
    path: "/form-setup",
    route: FormSetupRouter,
  },
  {
    path: "/form-setup/vital-master",
    route: formSetupVitalsMaster,
  },
  {
    path: "/ipd-form-setup",
    route: ipdFormSetup,
  },
  {
    path: "/ipd-form-setup/careplan",
    route: CarePlanRouter,
  },
  {
    path: "/template-radiology",
    route: TemplateReport,
  },
  {
    path: "/template-pathology",
    route: TemplateReport,
  },
  {
    path: "/pt",
    route: PTRouter,
  },
  {
    path: "/entry",
    route: EntryRouter,
  },
  {
    path: "/income",
    route: IncomeRouter,
  },
  {
    path: "/otherAllowances",
    route: OtherAllowancesRouter,
  },
  {
    path: "/section",
    route: TemplateSectionRouter,
  },
  {
    path: "/charity",
    route: charityMasterRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
