const mongoose = require('mongoose');

const SymptomSchema = new mongoose.Schema({
  symptomType: String,
  symptomDetails: [
    {
      title: String,
      descriptions: [String]
    }
  ]
});

module.exports = mongoose.model('Symptom', SymptomSchema);

















































// const SymptomSchema = new mongoose.Schema({
//   symptomType: String,
//   symptomDetails: [
//     {
//       title: String,
//       descriptions: [String]
//     }
//   ]
// });

// module.exports = mongoose.model('Symptom', SymptomSchema);