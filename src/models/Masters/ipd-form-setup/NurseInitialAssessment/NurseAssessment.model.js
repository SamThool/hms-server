const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  selected: { type: Boolean, default: false }
});

const CategorySchema = new mongoose.Schema({
  category: { type: String, required: true },
  options: [OptionSchema]
});

const NurseAssessmentSchema = new mongoose.Schema({
  nurseInitialAssessment: [CategorySchema],
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('NurseAssessment', NurseAssessmentSchema);
