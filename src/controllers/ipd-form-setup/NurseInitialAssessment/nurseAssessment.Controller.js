const NurseAssessment = require('../../../models/Masters/ipd-form-setup/NurseInitialAssessment/NurseAssessment.model');

// Create a new assessment
exports.createAssessment = async (req, res) => {
  try {
    const assessment = new NurseAssessment(req.body);
    await assessment.save();
    res.status(201).json(assessment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all assessments
exports.getAllAssessments = async (req, res) => {
  try {
    const assessments = await NurseAssessment.find();
    res.status(200).json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update assessment by ID
exports.updateAssessment = async (req, res) => {
  try {
    const updatedAssessment = await NurseAssessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAssessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.status(200).json(updatedAssessment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Delete assessment by ID
exports.deleteAssessment = async (req, res) => {
  try {
    await NurseAssessment.findByIdAndDelete(req.params.id);
    console.log("request for delete",req.params.id );
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};