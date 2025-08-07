const express = require("express");
const opdRouter = express.Router();
const { opdController } = require("../../controllers");
const { handleToken } = require("../../utils/handleToken");

opdRouter.post("/", handleToken, opdController.createOpdRegistion);
opdRouter.put("/update/:id", handleToken, opdController.updateOpdRegistion);
opdRouter.put(
  "/confirm/:id",
  handleToken,
  opdController.changeConfirmAppointmentStatus
);
opdRouter.put(
  "/cancel/:id",
  handleToken,
  opdController.changeCancelAppointmentStatus
);

opdRouter.get("/", handleToken, opdController.getAllOpdRegistration);
opdRouter.get("/count", handleToken, opdController.getCountByConsultant);
opdRouter.post(
  "/date-wise",
  handleToken,
  opdController.getOPDRegistrationResponse
);
opdRouter.get("/live", handleToken, opdController.getOPDRegistrationBYBilling);
opdRouter.put("/:id", handleToken, opdController.changePatientInStatus);

// Medical Problem
opdRouter.get(
  "/medical-problem",
  handleToken,
  opdController.getAllMedicalProblem
);

opdRouter.delete(
  "/patient-history/fromHistory/delete/:id",
  handleToken,
  opdController.deleteHistoryFromMedicalHistory
);
opdRouter.post(
  "/medical-problem",
  handleToken,
  opdController.createMedicalProblem
);
opdRouter.put(
  "/medical-problem/:id",
  handleToken,
  opdController.updateMedicalProblem
);
opdRouter.delete(
  "/medical-problem",
  handleToken,
  opdController.deleteMedicalProblemById
);
opdRouter.get(
  "/medical-problem/most-used/:id",
  handleToken,
  opdController.GetMostUsedMedicalProblem
);

// Family
opdRouter.get(
  "/family-problem",
  handleToken,
  opdController.getAllFamilyHistoryProblems
);
opdRouter.get(
  "/family-problem/most-used/:id",
  handleToken,
  opdController.getMostUsedFamilyProblems
);
opdRouter.post(
  "/family-problem",
  handleToken,
  opdController.createFamilyHistoryProblem
);
opdRouter.put(
  "/family-problem/:id",
  handleToken,
  opdController.updateFamilyHistoryProblem
);
opdRouter.delete(
  "/family-problem",
  handleToken,
  opdController.deleteFamilyHistoryProblems
);

//Drug History
opdRouter.get("/drug-history", handleToken, opdController.getAllDrugHistory);
opdRouter.post("/drug-history", handleToken, opdController.createDrugHistory);
opdRouter.put(
  "/drug-history/:id",
  handleToken,
  opdController.updateDrugHistory
);
opdRouter.delete(
  "/drug-history",
  handleToken,
  opdController.deleteDrugHistoryById
);
opdRouter.get(
  "/drug-history/most-used/:id",
  handleToken,
  opdController.GetMostUsedDrugHistory
);

// Drug Allergy
opdRouter.get("/drug-allergy", handleToken, opdController.getAllDrugAllergy);
opdRouter.post("/drug-allergy", handleToken, opdController.createDrugAllergy);
opdRouter.put(
  "/drug-allergy/:id",
  handleToken,
  opdController.updateDrugAllergyById
);
opdRouter.delete(
  "/drug-allergy",
  handleToken,
  opdController.deleteDrugAllergyByIds
);
opdRouter.get(
  "/drug-allergy/most-used/:id",
  handleToken,
  opdController.GetMostUsedDrugAllergy
);

// Food Allergy
opdRouter.get("/food-allergy", handleToken, opdController.getAllFoodAllergy);
opdRouter.post("/food-allergy", handleToken, opdController.createFoodAllergy);
opdRouter.put(
  "/food-allergy/:id",
  handleToken,
  opdController.updateFoodAllergyById
);
opdRouter.delete(
  "/food-allergy",
  handleToken,
  opdController.deleteFoodAllergyByIds
);
opdRouter.get(
  "/food-allergy/most-used/:id",
  handleToken,
  opdController.GetMostUsedFoodAllergy
);

// General Allergy
opdRouter.get(
  "/general-allergy",
  handleToken,
  opdController.getAllGeneralAllergy
);
opdRouter.post(
  "/general-allergy",
  handleToken,
  opdController.createGeneralAllergy
);
opdRouter.put(
  "/general-allergy/:id",
  handleToken,
  opdController.updateGeneralAllergyById
);
opdRouter.delete(
  "/general-allergy",
  handleToken,
  opdController.deleteGeneralAllergyByIds
);
opdRouter.get(
  "/general-allergy/most-used/:id",
  handleToken,
  opdController.GetMostUsedGeneralAllergy
);

// Family Member
opdRouter.get("/family-member", handleToken, opdController.getAllFamilyMember);
opdRouter.post("/family-member", handleToken, opdController.createFamilyMember);
opdRouter.delete(
  "/family-member/:id",
  handleToken,
  opdController.deleteFamilyMember
);
opdRouter.get(
  "/family-member/most-used/:id",
  handleToken,
  opdController.GetMostUsedFamilyMember
);

// Life Style
opdRouter.delete(
  "/gynac-history/gynac-history/delete/:id",
  handleToken,
  opdController.deleteGynacHistoryFormHistory
);
opdRouter.delete(
  "/gynac-history/objective/:id",
  handleToken,
  opdController.deleteGynacObjectiveEntriesByIndex
);

opdRouter.delete(
  "/gynac-history/inner-objective-data/:id",
  handleToken,
  opdController.deleteGynacInnerObjectiveDataEntries
);

opdRouter.delete(
  "/gynac-history/inner-objective-data-by-index/:id",
  handleToken,
  opdController.deleteGynacObjectiveInnerDataEntriesByIndex
);

opdRouter.put(
  "/gynac-history/edit-inner-objective-data/:id",
  handleToken,
  opdController.editGynacObjectiveInnerDataEntry
);

opdRouter.put(
  "/gynac-history/objective/:id",
  handleToken,
  opdController.updateObjectiveGynac
);

opdRouter.post("/gynac-history", handleToken, opdController.createGynacHistory);

opdRouter.get("/gynac-history", handleToken, opdController.getAllGynacHistory);

opdRouter.put(
  "/gynac-history/subjective/:id",
  handleToken,
  opdController.updateSubjectiveGynacHistoryById
);

opdRouter.put(
  "/gynac-history/subjective-layer-2/:id",
  handleToken,
  opdController.addLayer2SubjectiveGynacHistory
);

opdRouter.put(
  "/gynac-history/subjective-layer-3/:id",
  handleToken,
  opdController.addLayer3SubjectiveGynac
);

opdRouter.put(
  "/gynac-history/:id",
  handleToken,
  opdController.updateGynacHistoryById
);

opdRouter.put(
  "/gynac-history/objective-layer/:id",
  handleToken,
  opdController.updateObjectiveLayerForGynacHistory
);

opdRouter.put(
  "/gynac-history-last-layer/:id",
  handleToken,
  opdController.updateGynacHistoryByIdForLastLayer
);

opdRouter.post(
  "/gynac-history/patient",
  handleToken,
  opdController.addGynacHistoryForPatient
);

opdRouter.get(
  "/gynac-history/patient/:id",
  handleToken,
  opdController.getGynacHistoryByPatientId
);

opdRouter.delete(
  "/gynac-history",
  handleToken,
  opdController.deleteGynacHistoryByIds
);

opdRouter.get(
  "/gynac-history/most-used/:id",
  handleToken,
  opdController.GetMostUsedGynacHistory
);

opdRouter.put(
  "/gynac-history/objective-entry/:id",
  handleToken,
  opdController.updateGynacObjectiveEntryByIndex
);

opdRouter.delete(
  "/other-history/objective/:id",
  handleToken,
  opdController.deleteOtherObjectiveEntriesByIndex
);
opdRouter.delete(
  "/other-history/other-history/delete/:id",
  handleToken,
  opdController.deleteHistoryFormHistoryController
);


opdRouter.delete(
  "/other-history/inner-objective-data/:id",
  handleToken,
  opdController.deleteOtherInnerObjectiveDataEntries
);

opdRouter.delete(
  "/other-history/inner-objective-data-by-index/:id",
  handleToken,
  opdController.deleteOtherObjectiveInnerDataEntriesByIndex
);

opdRouter.put(
  "/other-history/edit-inner-objective-data/:id",
  handleToken,
  opdController.editOtherObjectiveInnerDataEntry
);

opdRouter.put(
  "/other-history/objective/:id",
  handleToken,
  opdController.updateObjectiveOther
);

opdRouter.post("/other-history", handleToken, opdController.createOtherHistory);

opdRouter.get("/other-history", handleToken, opdController.getAllOtherHistory);

opdRouter.put(
  "/other-history/subjective/:id",
  handleToken,
  opdController.updateSubjectiveOtherHistoryById
);

opdRouter.put(
  "/other-history/subjective-layer-2/:id",
  handleToken,
  opdController.addLayer2SubjectiveOtherHistory
);

opdRouter.put(
  "/other-history/subjective-layer-3/:id",
  handleToken,
  opdController.addLayer3SubjectiveOthers
);

opdRouter.put(
  "/other-history/:id",
  handleToken,
  opdController.updateOtherHistoryById
);

opdRouter.put(
  "/other-history/objective-layer/:id",
  handleToken,
  opdController.updateObjectiveLayerForOtherHistory
);

opdRouter.put(
  "/other-history-last-layer/:id",
  handleToken,
  opdController.updateOtherHistoryByIdForLastLayer
);

opdRouter.post(
  "/other-history/patient",
  handleToken,
  opdController.addOtherHistoryForPatient
);

opdRouter.get(
  "/other-history/patient/:id",
  handleToken,
  opdController.getOtherHistoryByPatientId
);

opdRouter.delete(
  "/other-history",
  handleToken,
  opdController.deleteOtherHistoryByIds
);

opdRouter.get(
  "/other-history/most-used/:id",
  handleToken,
  opdController.GetMostUsedOtherHistory
);

opdRouter.put(
  "/other-history/objective-entry/:id",
  handleToken,
  opdController.updateOtherObjectiveEntryByIndex
);

opdRouter.get("/life-style", handleToken, opdController.getAllLifeStyle);
opdRouter.post("/life-style", handleToken, opdController.createLifeStyle);
opdRouter.delete("/life-style/personal-history/delete:id", handleToken, opdController.deletelifeStylePersonalHistory);
opdRouter.put(
  "/life-style/:id",
  handleToken,
  opdController.updateLifeStyleById
);
opdRouter.put(
  "/subjective-life-style/:id",
  handleToken,
  opdController.updateSubjectiveLifestyleById
);
opdRouter.put(
  "/subjective-layer-2-life-style/:id",
  handleToken,
  opdController.addLayer2SubjectiveLifestyle
);
opdRouter.put(
  "/subjective-layer-3-life-style/:id",
  handleToken,
  opdController.addLayer3SubjectiveLifestyle
);

opdRouter.put(
  "/life-history/objective-layer/:id",
  handleToken,
  opdController.updateObjectiveLayer
);

opdRouter.get(
  "/life-style/personal-history/:id",
  handleToken,
  opdController.GetpersonalHistorybypatientId
);
opdRouter.post("/life-style/personal-history", handleToken, opdController.addPersnalHistory);


opdRouter.put(
  "/life-style-lastLayer/:id",
  handleToken,
  opdController.updateLifeStyleByIdForLastLayer
);
opdRouter.delete(
  "/life-style",
  handleToken,
  opdController.deleteLifeStyleByIds
);
opdRouter.get(
  "/life-style/most-used/:id",
  handleToken,
  opdController.GetMostUsedLifeStyle
);
opdRouter.delete(
  "/life-style/:id",
  handleToken,
  opdController.deleteLifeStyleObjectiveEntriesByIndex
);
opdRouter.delete(
  "/life-style/inner-data/:id",
  handleToken,
  opdController.deleteLifeStyleObjectiveInnerDataEntriesByIndex
);
opdRouter.delete(
  "/life-style/innerObjective-data/:id",
  handleToken,
  opdController.deleteLifeStyleInnerObjectiveDataEntries
);

opdRouter.put(
  "/life-style/objective/:id",
  handleToken,
  opdController.updateObjectiveLifeStyle
);
opdRouter.put(
  "/life-style/objective-data/:id",
  handleToken,
  opdController.updateLifeStyleObjectiveEntryByIndex
);
opdRouter.put(
  "/life-style/inner-data/objective-data/:id",
  handleToken,
  opdController.editLifeStyleObjectiveInnerDataEntry
);

// Obstetric History
// opdRouter.delete(
//   "/obstetric-history/:id",
//   handleToken,
//   opdController.deleteObstetricObjectiveEntriesByIndex
// );
// opdRouter.delete(
//   "/obstetric-history/inner-data/:id",
//   handleToken,
//   opdController.deleteObstetricObjectiveInnerDataEntriesByIndex
// );
// opdRouter.put(
//   "/obstetric-history/objective-data/:id",
//   handleToken,
//   opdController.updateObstetricObjectiveEntryByIndex
// );
// opdRouter.put(
//   "/obstetric-history/objective-data/inner-data/:id",
//   handleToken,
//   opdController.editObstetricObjectiveInnerDataEntry
// );
// opdRouter.get(
//   "/obstetric-history",
//   handleToken,
//   opdController.getAllObstetricHistory
// );
// opdRouter.post(
//   "/obstetric-history",
//   handleToken,
//   opdController.createObstetricHistory
// );
// opdRouter.put(
//   "/obstetric-history/:id",
//   handleToken,
//   opdController.updateObstetricHistoryById
// );
// opdRouter.delete(
//   "/obstetric-history",
//   handleToken,
//   opdController.deleteObstetricHistoryByIds
// );
// opdRouter.put(
//   "/obstetric-history/objective/:id",
//   handleToken,
//   opdController.updateObjectiveObstetricHistory
// );
// opdRouter.get(
//   "/obstetric-history/most-used/:id",
//   handleToken,
//   opdController.GetMostUsedObstetricHistory
// );
opdRouter.delete(
  "/obstetric-history/obstetric-history/delete/:id",
  handleToken,
  opdController.deleteObstetricHistoryFormHistory
);
opdRouter.get(
  "/obstetric-history",
  handleToken,
  opdController.getAllObstetricHistory
);
opdRouter.post(
  "/obstetric-history",
  handleToken,
  opdController.createObstetricHistory
);
opdRouter.put(
  "/obstetric-history/:id",
  handleToken,
  opdController.updateObstetricHistoryById
);
opdRouter.put(
  "/subjective-obstetric-history/:id",
  handleToken,
  opdController.updateSubjectiveObstetricHistoryById
);
opdRouter.put(
  "/subjective-layer-2-obstetric-history/:id",
  handleToken,
  opdController.addLayer2SubjectiveObstetricHistory
);
opdRouter.put(
  "/subjective-layer-3-obstetric-history/:id",
  handleToken,
  opdController.addLayer3SubjectiveObstetricHistory
);

opdRouter.put(
  "/obstetric-history/add-subjective/:id",
  handleToken,
  opdController.updateObjectiveLayerObstetricHistory
);

opdRouter.get(
  "/obstetric-history/patient/:id",
  handleToken,
  opdController.GetObstetricHistorybypatientId
);
opdRouter.post(
  "/obstetric-history/personal-history",
  handleToken,
  opdController.addObstetricHistoryHistory
);
opdRouter.post(
  "/obstetric-history/patient",
  handleToken,
  opdController.addObstetricHistoryHistoryByPatientId
);
opdRouter.put(
  "/obstetric-history-lastLayer/:id",
  handleToken,
  opdController.updateObstetricHistoryByIdForLastLayer
);
opdRouter.delete(
  "/obstetric-history",
  handleToken,
  opdController.deleteLifeStyleByIds
);
opdRouter.get(
  "/obstetric-history/most-used/:id",
  handleToken,
  opdController.GetMostUsedObstetricHistory
);
opdRouter.delete(
  "/obstetric-history/:id",
  handleToken,
  opdController.deleteObstetricHistoryObjectiveEntriesByIndex
);
opdRouter.delete(
  "/obstetric-history/inner-data/:id",
  handleToken,
  opdController.deleteObstetricHistoryObjectiveInnerDataEntriesByIndex
);
opdRouter.delete(
  "/obstetric-history/innerObjective-data/:id",
  handleToken,
  opdController.deleteObstetricHistoryInnerObjectiveDataEntries
);

opdRouter.put(
  "/obstetric-history/objective/:id",
  handleToken,
  opdController.updateObjectiveObstetricHistory
);
opdRouter.put(
  "/obstetric-history/objective-data/:id",
  handleToken,
  opdController.updateObstetricHistoryObjectiveEntryByIndex
);
opdRouter.put(
  "/obstetric-history/inner-data/objective-data/:id",
  handleToken,
  opdController.editObstetricHistoryObjectiveInnerDataEntry
);

// Nutritional History

opdRouter.delete(
  "/Nutritional-history/Nutritional-history/delete/:id",
  handleToken,
  opdController.deleteNutritionalHistoryFormHistory
);
opdRouter.delete(
  "/Nutritional-history/objective/:id",
  handleToken,
  opdController.deleteNutritionalObjectiveEntriesByIndex
);

opdRouter.delete(
  "/Nutritional-history/inner-objective-data/:id",
  handleToken,
  opdController.deleteNutritionalInnerObjectiveDataEntries
);

opdRouter.delete(
  "/Nutritional-history/inner-objective-data-by-index/:id",
  handleToken,
  opdController.deleteNutritionalObjectiveInnerDataEntriesByIndex
);

opdRouter.put(
  "/Nutritional-history/edit-inner-objective-data/:id",
  handleToken,
  opdController.editNutritionalObjectiveInnerDataEntry
);

opdRouter.put(
  "/Nutritional-history/objective/:id",
  handleToken,
  opdController.updateObjectiveNutritional
);

opdRouter.post(
  "/Nutritional-history",
  handleToken,
  opdController.createNutritionalHistory
);

opdRouter.get(
  "/Nutritional-history",
  handleToken,
  opdController.getAllNutritionalHistory
);

opdRouter.put(
  "/Nutritional-history/subjective/:id",
  handleToken,
  opdController.updateSubjectiveNutritionalHistoryById
);

opdRouter.put(
  "/Nutritional-history/subjective-layer-2/:id",
  handleToken,
  opdController.addLayer2SubjectiveNutritionalHistory
);

opdRouter.put(
  "/Nutritional-history/subjective-layer-3/:id",
  handleToken,
  opdController.addLayer3SubjectiveNutritional
);

opdRouter.put(
  "/Nutritional-history/:id",
  handleToken,
  opdController.updateNutritionalHistoryById
);

opdRouter.put(
  "/Nutritional-history/objective-layer/:id",
  handleToken,
  opdController.updateObjectiveLayerForNutritionalHistory
);

opdRouter.put(
  "/Nutritional-history-last-layer/:id",
  handleToken,
  opdController.updateNutritionalHistoryByIdForLastLayer
);

opdRouter.post(
  "/Nutritional-history/patient",
  handleToken,
  opdController.addNutritionalHistoryForPatient
);

opdRouter.get(
  "/Nutritional-history/patient/:id",
  handleToken,
  opdController.getNutritionalHistoryByPatientId
);

opdRouter.delete(
  "/Nutritional-history",
  handleToken,
  opdController.deleteNutritionalHistoryByIds
);

opdRouter.get(
  "/Nutritional-history/most-used/:id",
  handleToken,
  opdController.GetMostUsedNutritionalHistory
);

opdRouter.put(
  "/Nutritional-history/objective-entry/:id",
  handleToken,
  opdController.updateNutritionalObjectiveEntryByIndex
);

// Pediatric History
opdRouter.delete(
  "/pediatric-history/pediatric-history/delete/:id",
  handleToken,
  opdController.deletePediatricHistoryFormHistory
);
opdRouter.delete(
  "/pediatric-history/objective/:id",
  handleToken,
  opdController.deletePediatricObjectiveEntriesByIndex
);

opdRouter.delete(
  "/pediatric-history/inner-objective-data/:id",
  handleToken,
  opdController.deletePediatricInnerObjectiveDataEntries
);

opdRouter.delete(
  "/pediatric-history/inner-objective-data-by-index/:id",
  handleToken,
  opdController.deletePediatricObjectiveInnerDataEntriesByIndex
);

opdRouter.put(
  "/pediatric-history/edit-inner-objective-data/:id",
  handleToken,
  opdController.editPediatricObjectiveInnerDataEntry
);

opdRouter.put(
  "/pediatric-history/objective/:id",
  handleToken,
  opdController.updateObjectivePediatric
);

opdRouter.post(
  "/pediatric-history",
  handleToken,
  opdController.createPediatricHistory
);

opdRouter.get(
  "/pediatric-history",
  handleToken,
  opdController.getAllPediatricHistory
);

opdRouter.put(
  "/pediatric-history/subjective/:id",
  handleToken,
  opdController.updateSubjectivePediatricHistoryById
);

opdRouter.put(
  "/pediatric-history/subjective-layer-2/:id",
  handleToken,
  opdController.addLayer2SubjectivePediatricHistory
);

opdRouter.put(
  "/pediatric-history/subjective-layer-3/:id",
  handleToken,
  opdController.addLayer3SubjectivePediatric
);

opdRouter.put(
  "/pediatric-history/:id",
  handleToken,
  opdController.updatePediatricHistoryById
);

opdRouter.put(
  "/pediatric-history/objective-layer/:id",
  handleToken,
  opdController.updateObjectiveLayerForPediatricHistory
);

opdRouter.put(
  "/pediatric-history-last-layer/:id",
  handleToken,
  opdController.updatePediatricHistoryByIdForLastLayer
);

opdRouter.post(
  "/pediatric-history/patient",
  handleToken,
  opdController.addPediatricHistoryForPatient
);

opdRouter.get(
  "/pediatric-history/patient/:id",
  handleToken,
  opdController.getPediatricHistoryByPatientId
);

opdRouter.delete(
  "/pediatric-history",
  handleToken,
  opdController.deletePediatricHistoryByIds
);

opdRouter.get(
  "/pediatric-history/most-used/:id",
  handleToken,
  opdController.GetMostUsedPediatricHistory
);

opdRouter.put(
  "/pediatric-history/objective-entry/:id",
  handleToken,
  opdController.updatePediatricObjectiveEntryByIndex
);

// Procedure
opdRouter.get("/procedure", handleToken, opdController.getAllProcedure);
opdRouter.post("/procedure", handleToken, opdController.createProcedure);
opdRouter.put("/procedure/:id", handleToken, opdController.updateProcedureById);
opdRouter.delete("/procedure", handleToken, opdController.deleteProcedureByIds);
opdRouter.get(
  "/procedure/most-used/:id",
  handleToken,
  opdController.GetMostUsedProcedure
);
// advice 
opdRouter.post("/advice", handleToken, opdController.createAdvice);
opdRouter.get("/advice", handleToken, opdController.getAllAdvice);
opdRouter.put("/advice/delete", handleToken, opdController.deleteAdvice);
opdRouter.put("/advice/:id", handleToken, opdController.editAdvice);


// Instruction
opdRouter.get("/instruction", handleToken, opdController.getAllInstruction);
opdRouter.post("/instruction", handleToken, opdController.createInstruction);
opdRouter.put(
  "/instruction/:id",
  handleToken,
  opdController.updateInstructionById
);
opdRouter.delete(
  "/instruction",
  handleToken,
  opdController.deleteInstructionByIds
);
opdRouter.get(
  "/instruction/most-used/:id",
  handleToken,
  opdController.GetMostInstruction
);

// Chief Complaints
opdRouter.get(
  "/chief-complaint/:id",
  handleToken,
  opdController.getAllChiefComplaint
);
opdRouter.get(
  "/pain-chief-complaint/:id",
  handleToken,
  opdController.getAllPainChiefComplaint
);
opdRouter.post(
  "/chief-complaint",
  handleToken,
  opdController.createChiefComplaint
);
opdRouter.post(
  "/pain-chief-complaint",
  handleToken,
  opdController.createPainChiefComplaint
);
opdRouter.put(
  "/chief-complaint/symptoms/:id",
  handleToken,
  opdController.updateCheifcomplaint
);
opdRouter.put(
  "/chief-complaint/description/:id",
  handleToken,
  opdController.updateDescriptionCheifcomplaint
);
opdRouter.put(
  "/pain-chief-complaint/releving-factors/:id",
  handleToken,
  opdController.updateRelevingFactors
);
opdRouter.put(
  "/chief-complaint/since/:id",
  handleToken,
  opdController.updateSinceCheifcomplaint
);
opdRouter.put(
  "/chief-complaint/treatment/:id",
  handleToken,
  opdController.updateTreatmentCheifcomplaint
);
opdRouter.put(
  "/chief-complaint/location/:id",
  handleToken,
  opdController.updateLocationCheifcomplaint
);
opdRouter.put(
  "/pain-chief-complaint/location/:id",
  handleToken,
  opdController.updatePainLocationCheifcomplaint
);
opdRouter.put(
  "/pain-chief-complaint/quality/:id",
  handleToken,
  opdController.updateQualityPain
);
opdRouter.put(
  "/pain-chief-complaint/nature-of-pain/:id",
  handleToken,
  opdController.updateNatureOfPain
);
opdRouter.put(
  "/pain-chief-complaint/agg-factors/:id",
  handleToken,
  opdController.updateAggregatingFactors
);
opdRouter.put(
  "/pain-chief-complaint/duration/:id",
  handleToken,
  opdController.updatePainDuration
);
opdRouter.get(
  "/chief-complaint/most-used/:id",
  handleToken,
  opdController.GetMostCheifcomplaint
);
opdRouter.put(
  "/chief-complaint/:id",
  handleToken,
  opdController.updateCheifcomplaintById
);
opdRouter.put(
  "/chief-complaint-pain/:id",
  handleToken,
  opdController.updatePainChiefComplaintAll
);
opdRouter.delete(
  "/chief-complaint",
  handleToken,
  opdController.deleteCheifcomplaintByIds
);
opdRouter.delete(
  "/pain-chief-complaint/:id",
  handleToken,
  opdController.deleteSinglePainChiefComplaint
);
opdRouter.delete(
  "/chief-complaint-single/:id",
  handleToken,
  opdController.deleteSingleChiefComplaint
);

// Present Illness History Complaints
opdRouter.get(
  "/present-illness",
  handleToken,
  opdController.getAllPresentIllnessHistory
);
opdRouter.post(
  "/present-illness",
  handleToken,
  opdController.createPresentIllnessHistory
);
opdRouter.put(
  "/present-illness/:id",
  handleToken,
  opdController.updatePresentIllnessHistory
);
opdRouter.put(
  "/present-illness/objective/:id",
  handleToken,
  opdController.updateObjectivePresentIllnessHistory
);
opdRouter.delete(
  "/present-illness",
  handleToken,
  opdController.deletePresentIllnessHistoryByIds
);
opdRouter.get(
  "/present-illness/most-used/:id",
  handleToken,
  opdController.GetMostPresentIllnessHistory
);

// Provisional Diagnosis
opdRouter.get(
  "/provisional-diagnosis",
  handleToken,
  opdController.getAllProvisionalDiagnosis
);
opdRouter.post(
  "/provisional-diagnosis",
  handleToken,
  opdController.createProvisionalDiagnosis
);
opdRouter.put(
  "/provisional-diagnosis/:id",
  handleToken,
  opdController.updateProvisionalDiagnosisById
);
opdRouter.delete(
  "/provisional-diagnosis",
  handleToken,
  opdController.deleteProvisionalDiagnosisByIds
);
opdRouter.get(
  "/provisional-diagnosis/most-used",
  handleToken,
  opdController.GetMostProvisionalDiagnosis
);
opdRouter.post(
  "/provisional-diagnosis/import",
  handleToken,
  opdController.importJson
);

// Final Diagnosis
opdRouter.get(
  "/final-diagnosis",
  handleToken,
  opdController.getAllFinalDiagnosis
);
opdRouter.post(
  "/final-diagnosis",
  handleToken,
  opdController.createFinalDiagnosis
);
opdRouter.put(
  "/final-diagnosis/:id",
  handleToken,
  opdController.updateFinalDiagnosisById
);
opdRouter.delete(
  "/final-diagnosis",
  handleToken,
  opdController.deleteFinalDiagnosisByIds
);
opdRouter.get(
  "/final-diagnosis/most-used/:id",
  handleToken,
  opdController.GetMostFinalDiagnosis
);

// Risk Factor

opdRouter.get("/risk-factor", handleToken, opdController.getAllRiskFactor);
opdRouter.post("/risk-factor", handleToken, opdController.createRiskFactor);
opdRouter.get(
  "/risk-factor/most-used/:id",
  handleToken,
  opdController.GetMostRiskFactor
);

// OPD Menu
opdRouter.get("/opd-menu", handleToken, opdController.getOpdMenu);
opdRouter.put("/opd-menu/:id", handleToken, opdController.updatedOPDMenu);

// Local Examination
opdRouter.get(
  "/local-examination",
  handleToken,
  opdController.getAllLocalExamination
);
opdRouter.post(
  "/local-examination",
  handleToken,
  opdController.createLocalExamination
);
opdRouter.put(
  "/local-examination/:id",
  handleToken,
  opdController.updateLocalExamination
);
opdRouter.put(
  "/local-examination-all/:id",
  handleToken,
  opdController.updateLocalExaminationById
);
opdRouter.put(
  "/local-examination-diagram/:id",
  handleToken,
  opdController.updateDiagramInLocalExamination
);
opdRouter.put(
  "/local-examination-diagram-delete/:id",
  handleToken,
  opdController.updateDiagramInLocalExaminationDelete
);
opdRouter.delete(
  "/local-examination",
  handleToken,
  opdController.deleteLocalExaminationByIds
);
opdRouter.get(
  "/local-examination/most-used/:id",
  handleToken,
  opdController.GetMostUsedLocalExamination
);
opdRouter.delete(
  "/local-examination/sub-disorder",
  handleToken,
  opdController.deleteLocalExaminationSubDisorderByIds
);
opdRouter.put(
  "/local-examination/sub-disorder/:objectId/:subDisorderId",
  handleToken,
  opdController.updateLocalExaminationSubDisorderById
);

// General Examination
opdRouter.get(
  "/general-examination",
  handleToken,
  opdController.getAllGeneralExamination
);
opdRouter.post(
  "/general-examination",
  handleToken,
  opdController.createGeneralExamination
);
opdRouter.put(
  "/general-examination/:id",
  handleToken,
  opdController.updateGeneralExamination
);
opdRouter.put(
  "/general-examination-all/:id",
  handleToken,
  opdController.updateGeneralExaminationById
);
opdRouter.put(
  "/general-examination/lastLayer/:id",
  handleToken,
  opdController.addNestedObjective
);
opdRouter.put(
  "/general-examination/MostlastLayer/:id",
  handleToken,
  opdController.addMostNestedObjective
);
opdRouter.put(
  "/local-examination/lastLayer/:id",
  handleToken,
  opdController.addNestedObjectiveForLocal
);

opdRouter.put(
  "/local-examination/MostlastLayer/:id",
  handleToken,
  opdController.addMostNestedObjectiveForLocal
);


opdRouter.put(
  "/systemic-examination/lastLayer/:id",
  handleToken,
  opdController.addNestedObjectiveForSystemic
);

opdRouter.put(
  "/systemic-examination/MostlastLayer/:id",
  handleToken,
  opdController.addMostNestedObjectiveForSystemic
);
opdRouter.delete(
  "/general-examination",
  handleToken,
  opdController.deleteGeneralExaminationByIds
);
opdRouter.delete(
  "/examination-delete-fourth-layer/:id",
  handleToken,
  opdController.deleteExaminationInnerDataEntriesByIndex
);
opdRouter.delete(
  "/examination-delete-third-layer/:id",
  handleToken,
  opdController.deleteExaminationObjectives
);

opdRouter.delete(
  "/examination-delete-third-layer/first-layer/:id",
  handleToken,
  opdController.deleteExaminationObjectivesfromFirstLayer
);

opdRouter.put(
  "/general-examination/add-objective-option/:id",
  handleToken,
  opdController.examinationAddObjectiveOption
);

opdRouter.put(
  "/local-examination/add-objective-option/:id",
  handleToken,
  opdController.examinationAddObjectiveOptionForLocal
);
opdRouter.put(
  "/systemic-examination/add-objective-option/:id",
  handleToken,
  opdController.examinationAddObjectiveOptionForSystemic
);
opdRouter.put(
  "/examination-update-fourth-layer/:id",
  handleToken,
  opdController.editExaminationInnerDataEntry
);
opdRouter.put(
  "/examination-update-third-layer/:id",
  handleToken,
  opdController.editExaminationObjectiveDataLayer3
);
opdRouter.put(
  "/examination-update-diagram/:id",
  handleToken,
  opdController.editExaminationDiagram
);
opdRouter.get(
  "/general-examination/most-used/:id",
  handleToken,
  opdController.GetMostUsedGeneralExamination
);
opdRouter.delete(
  "/general-examination/sub-disorder",
  handleToken,
  opdController.deleteGeneralExaminationSubDisorderByIds
);
opdRouter.put(
  "/general-examination/sub-disorder/:objectId/:subDisorderId",
  handleToken,
  opdController.updateGeneralExaminationSubDisorderById
);

// Systematic Examination
opdRouter.get(
  "/systematic-examination",
  handleToken,
  opdController.getAllSystematicExamination
);
opdRouter.post(
  "/systematic-examination",
  handleToken,
  opdController.createSystematicExamination
);
opdRouter.put(
  "/systematic-examination/:id",
  handleToken,
  opdController.updateSystematicExamination
);
opdRouter.put(
  "/systematic-examination-all/:id",
  handleToken,
  opdController.updateAllSystematicExamination
);
opdRouter.put(
  "/systematic-examination-diagram/:id",
  handleToken,
  opdController.updateDiagramInSystematicExamination
);
opdRouter.put(
  "/systematic-examination-diagram-delete/:id",
  handleToken,
  opdController.updateDiagramInSystematicExaminationDelete
);
opdRouter.delete(
  "/systematic-examination",
  handleToken,
  opdController.deleteSystematicExaminationByIds
);
opdRouter.get(
  "/systematic-examination/most-used/:id",
  handleToken,
  opdController.GetMostUsedSystematicExamination
);
opdRouter.delete(
  "/systematic-examination/sub-disorder",
  handleToken,
  opdController.deleteSystematicExaminationSubDisorderByIds
);
opdRouter.put(
  "/systematic-examination/sub-disorder/:objectId/:subDisorderId",
  handleToken,
  opdController.updateSystematicExaminationSubDisorderById
);

// Other Examination
opdRouter.get(
  "/other-examination",
  handleToken,
  opdController.getAllOtherExamination
);
opdRouter.post(
  "/other-examination",
  handleToken,
  opdController.createOtherExamination
);
opdRouter.put(
  "/other-examination/:id",
  handleToken,
  opdController.updateOtherExaminationById
);
opdRouter.delete(
  "/other-examination",
  handleToken,
  opdController.deleteOtherExaminationByIds
);
opdRouter.get(
  "/other-examination/most-used/:id",
  handleToken,
  opdController.GetMostUsedOtherExamination
);

// for patient procedure
opdRouter.get(
  "/surgery-package/most-used/:id",
  handleToken,
  opdController.GetMostUsedSurgeryPackage
);

// for lab radiology pathology
opdRouter.get(
  "/lab-pathology/most-used/:id",
  handleToken,
  opdController.GetMostUsedPathologyInvest
);
opdRouter.get(
  "/lab-radiology/most-used/:id",
  handleToken,
  opdController.GetMostUsedRadiologyInvest
);

opdRouter.get(
  "/allpatientdetails/:patientId",
  handleToken,
  opdController.getAllPatientData
);
opdRouter.get(
  "/all-patient-details-to-print/:patientId/:consultantId",
  handleToken,
  opdController.getAllPatientdataToPrint
);

opdRouter.post("/opdbilling", handleToken, opdController.createOPDBilling);
opdRouter.get(
  "/opdbilling/:patientId/:opdId",
  handleToken,
  opdController.getOPDBilling
);
opdRouter.get(
  "/opdbilling/most-used-service/:departmentId/:patientPayeeId",
  handleToken,
  opdController.getMostUsedServiceDetails
);

// opd patient count by consultant
opdRouter.get(
  "/opd-patient-count-by-consultant",
  handleToken,
  opdController.getPatientCountByConsultant
);
module.exports = opdRouter;
