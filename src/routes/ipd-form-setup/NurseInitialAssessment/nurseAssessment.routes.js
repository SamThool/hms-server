const express = require('express');
const NurseAssessmentRouter = express.Router();
const {
  createAssessment,
  getAllAssessments,
  deleteAssessment,
  updateAssessment
} = require('../../../controllers/ipd-form-setup/NurseInitialAssessment/nurseAssessment.Controller')


NurseAssessmentRouter.post('/', createAssessment);
NurseAssessmentRouter.get('/', getAllAssessments);
NurseAssessmentRouter.delete('/:id', deleteAssessment);
NurseAssessmentRouter.put('/:id', updateAssessment);

module.exports = NurseAssessmentRouter ;