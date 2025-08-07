module.exports.AdminModel = require('./admin.model')
module.exports.CompanySetupModel = require('./companySetup.model')
module.exports.DepartmentSetupModel = require('./departmentSetup.model')
module.exports.PincodeModel = require('./pincodes.model')
module.exports.SuperAdminModel = require('./superAdmin.model')

// Chat
module.exports.ChatModel = require('./Chat/chat.model')
//Room Manage
module.exports.RoomTypeModel = require('./Manage Room/roomType.model')
module.exports.bedMasterModel = require('./Manage Room/bedMaster.model')
module.exports.rateMasterModel = require('./Manage Room/rateMaster.model')

//Masters
module.exports.AppointmentSchedulingModel = require('./Masters/appointment.model')
module.exports.BillGroupModel = require('./Masters/billgroup.model')
module.exports.DesignationModel = require('./Masters/designation.model')
module.exports.OutsourceDiagnosticsModel = require('./Masters/outsourceDiagnostic.model')
module.exports.PartyMasterModel = require('./Masters/partyMaster.model')
module.exports.ProductMasterModel = require('./Masters/productMaster.model')
module.exports.StoreModel = require('./Masters/store.model')
module.exports.ServiceDetailsModel = require('./Masters/serviceDetailsMaster.model')
module.exports.OPDPackageModel = require('./Masters/opd_package.model')
module.exports.SurgeryPackageModel = require('./Masters/surgeryPackageMaster.model')
module.exports.OtMasterModel = require('./Masters/otMaster.model')
module.exports.UHID_MRN_Model = require('./Masters/uhid_mrn_name.model')
module.exports.PaymentModeModel = require('./Masters/payment_mode.model')
module.exports.EmployeeRoleModel = require('./Masters/employee_role.model')
module.exports.VitalModel = require('./Masters/vitals.model')
module.exports.MedicinesModel = require('./Masters/medicine.model')
module.exports.LedgerModel = require('./Masters/ledger.model')
module.exports.File=require('./Masters/Template/file.model')
module.exports.SubLedgerModel = require('./Masters/sub_ledger.model')
module.exports.TPACompanyMasterModel = require('./Masters/tpa_master.model')
module.exports.InsuranceCompanyMasterModel = require('./Masters/insurance_comapny_master.model')
module.exports.GovCompanyMasterModel = require('./Masters/goverment_company_master.model')
module.exports.CoOperateCompanyMasterModel = require('./Masters/co-operate_company_master.model')
module.exports.IncomeModel=require('./Masters/hr-setup/income.model');
module.exports.InitialPainAssessment=require('./Masters/ipd-form-setup/InitialPainAsessment/initialPainAssessment.model');
module.exports.RectangularBoxes=require('./Masters/ipd-form-setup/InitialPainAsessment/rectangularBoxes.model.js')
module.exports.ChipModel=require("./Masters/ipd-form-setup/InitialPainAsessment/chips.model.js");
//hr setup master
module.exports.DiplomaMasterModel = require('./Masters/hr-setup/diploma.model')
module.exports.GraduationMasterModel = require('./Masters/hr-setup/graduation.model')
module.exports.PostGraduationMasterModel = require('./Masters/hr-setup/postGraduation.model')
module.exports.ListOfCouncilMasterModel = require('./Masters/hr-setup/listOfCouncil.model')
module.exports.SuperSpecializationMasterModel = require('./Masters/hr-setup/superSpecialization.model')
module.exports.TypeOfLeaveMasterModel = require('./Masters/hr-setup/typeOfLeave.model')
module.exports.LeaveManagerMasterModel = require('./Masters/hr-setup/leaveManager.model')
module.exports.DearnessAllowanceModel = require('./Masters/hr-setup/dearnessAllowance.model')
module.exports.HRAAllowanceMasterModel = require('./Masters/hr-setup/hraAllowance.model')
module.exports.OtherAllowanceModel=require('./Masters/hr-setup/otherAllowances.model')
module.exports.TemplateSectionModel=require('./Masters/Template/templateSection.model')
module.exports.TreatmentSheetModel=require('./Masters/ipd-form-setup/InitialPainAsessment/initialPainAssessment.model.js')
//Pathology
module.exports.MachineMasterModel = require('./Masters/Pathology_Master/machineMaster.model')
module.exports.InvestigationPathologyMasterModel = require('./Masters/Pathology_Master/investigationRadiologyMaster.model') //now test master
module.exports.SpecimenModel = require('./Masters/Pathology_Master/specimenMaster.model')
module.exports.UnitMasterModel = require('./Masters/Pathology_Master/unitMaster.model')
module.exports.ProfileMasterModel = require('./Masters/Pathology_Master/profileMaster.model')

//Radiology
module.exports.MachineRadiologyMasterModel = require('./Masters/Radiology_Master/machineRadiologyMaster.model')
module.exports.InvestigationRadiologyMasterModel = require('./Masters/Radiology_Master/investigationRadiologyMaster.model')
module.exports.SpecimenRadiologyMasterModel = require('./Masters/Radiology_Master/specimenRadiologyMaster.model')
module.exports.UnitRadiologyMasterModel = require('./Masters/Radiology_Master/unitRadiolgyMaster.model')

//Staffs
module.exports.ConsultantModel = require('./Staffs/consultants/consultants.model')
// module.exports.NursingModel = require("./Staffs/nursing/nursing.model");
module.exports.EmployeeModel = require('./Staffs/employee/employee.model')

module.exports.Administrative = require('./Staffs/administrative/administrative.model')
module.exports.Support = require('./Staffs/support/support.model')
module.exports.NursingAndParamedical = require('./Staffs/nursingAndParamedical/nursingAndParamedical.model')
module.exports.MedicalOfficer = require('./Staffs/medicalOfficer/medicalOfficer.model')
module.exports.Consultant = require('./Staffs/consultant/consultant.model')

//Patient
module.exports.PatientModel = require('./Patient/patient.model')
module.exports.BookApointmentModel = require('./Patient/bookappointment.model')
module.exports.ConfirmAppointmentModel = require('./Patient/confirmappointment.model')
module.exports.patientDetailsModel = require('./Patient/patientdetails.model')

// OPD
module.exports.OPDModel = require('./OPD/opd.model')
module.exports.MedicalProblemModel = require('./OPD/medicalpro.model')
module.exports.DrugHistoryModel = require('./OPD/drug_history.model')
module.exports.DrugAllergyModel = require('./OPD/drug_allergy.model')
module.exports.GeneralAllergyModel = require('./OPD/general_allergy.model')
module.exports.FoodAllergyModel = require('./OPD/food_allergy.model')
module.exports.FamilyMemberModel = require('./OPD/family_member.model')
module.exports.LifeStyleModel = require('./OPD/life_style.model')
module.exports.LifeStyleHistoryModelForPatient = require('./OPD/life_style.model')

module.exports.ProcedureModel = require('./OPD/procedure.model')
module.exports.AdviceModel = require('./OPD/advice.model')
module.exports.InstructionModel = require('./OPD/instructions.model')
module.exports.ChiefComplaintModel = require('./OPD/chiefcomplaint.model')
module.exports.PainChiefComplaintModel = require('./OPD/painChiefComplaint.model')
module.exports.PresentIllnessHistoryModel = require('./OPD/present_illness_history.model')
module.exports.ProvisionalDiagnosisModel = require('./OPD/provisional_diagnosis.model')
module.exports.FinalDiagnosisModel = require('./OPD/final_diagnosis.model')
module.exports.OPDMenuModel = require('./OPD/opd_menu.model')
module.exports.RiskFactorModel = require('./OPD/risk_factor.model')
module.exports.OPDBillingModel = require('./OPD/opd_billing.model')
module.exports.OPDReceiptModel = require('./OPDBillReceipts/OPDBillReceipt.model')
module.exports.GynacHistoryModel = require('./OPD/gynac_history.model')
module.exports.OtherHistoryModel = require('./OPD/other_history.model')
module.exports.ObstetricHistoryModel = require('./OPD/obstetric_history.model')
module.exports.NutritionalHistoryModel = require('./OPD/nutritional_history.model')
module.exports.PediatricHistoryModel = require('./OPD/pediatric_history.model')
module.exports.OPDReceiptNoModel = require('./OPDReceiptNo/opdReceiptNo')
module.exports.OPDTokenNoModel = require('./OPDTokenNo/OPDTokenNo')

// OPD/Examination Starts
module.exports.LocalExaminationModel = require('./OPD/Examination/local_examination.model')
module.exports.GeneralExaminationModel = require('./OPD/Examination/general_examination.model')
module.exports.SystematicExaminationModel = require('./OPD/Examination/systematic_examination.model')
module.exports.OtherExaminationModel = require('./OPD/Examination/other_examination.model')

//invoice no model
module.exports.InvoiceNoModel = require('./InvoiceNumber/invoiceNo.model')

// OPD/Patient Starts
module.exports.PatientHistroyModel = require('./OPD/Patient/patient_history.model')
module.exports.PatientChiefComplaintModel = require('./OPD/Patient/patient_chief_complaint.model')
module.exports.PatientGlassPrescriptionModel = require('./OPD/Patient/patient_glasss_prescription.model')
module.exports.PatientMedicalPrescriptionModel = require('./OPD/Patient/patient_medical_prescription.model')
module.exports.PatientFollowUpModel = require('./OPD/Patient/patient_followup.model')
module.exports.PatientProvisionalDiagnosisModel = require('./OPD/Patient/patient_provisional_diagnosis.model')
module.exports.PatientFinalDiagnosisModel = require('./OPD/Patient/patient_final_diagnosis.model')
module.exports.PatientProcedureModel = require('./OPD/Patient/patient_procedure.model')
module.exports.PatientPresentIllnessHistoryModel = require('./OPD/Patient/patient_present_illness.model')
module.exports.PatientLabRadiologyModel = require('./OPD/Patient/patient_lab_radiology.model')
module.exports.PatientInstructionModel = require('./OPD/Patient/patient_instruction.model')
module.exports.PatientVitalsModel = require('./OPD/Patient/patient_vitals.model')
module.exports.PatientExaminationModel = require('./OPD/Patient/patient_examination.model')
module.exports.EntryModel=require('./Masters/hr-setup/entry.model')

//Emergency/Patient Starts
module.exports.EmergencyPatientVitalsModel = require('./Emergency/Patient/emergency_patient_vitals.model')
module.exports.EmergencyPatientChiefComplaintModel = require('./Emergency/Patient/emergency_patient_chief_complaint.model')

//Role
module.exports.RoleModel = require('./roles.model')

// Prefix
module.exports.PrefixModel = require('./Masters/prefixMaster.model')

//RefferBy
module.exports.RefferBy = require('./Masters/refferBy.model')
module.exports.ActivityModel = require('./Masters/ipd-form-setup/InitialPainAsessment/initialPainAssessment.model.js')
//Category
module.exports.ParentGroupModel = require('./Masters/parentGroup.model')
module.exports.PayeeParentGroupModel = require('./Masters/payeeParent.model')
module.exports.PatientPayeeModel = require('./Masters/patientpayee.model')
module.exports.CategoryMasterModel = require('./Masters/category.model')
