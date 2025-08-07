const mongoose = require("mongoose");
const systemicExaminationObjective = new mongoose.Schema({
    name:String,
    answerType:String,
    objective:[this]
}, { _id: true, _id: true, timestamps: false })
systemicExaminationObjective.add({objective:[systemicExaminationObjective]})
 
const subDisoder = new mongoose.Schema({
        name: String,
            count: { type: Number, default: 0 },
            answerType: String,
            objective: [systemicExaminationObjective],
}, { _id: true, _id: true, timestamps: false })
const SystematicExaminationSchema = new mongoose.Schema({
    exam: {
        disorder: String,
        subDisorder: [{
            name: String,
            count: { type: Number, default: 0 },
            answerType: String,
            objective: [subDisoder],
        }],
        diagram:String,
    },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant' },
    delete: { type: Boolean, default: false }
}, { timestamps: true });

const SystematicExaminationModel = mongoose.model('Systematic_Examination' , SystematicExaminationSchema);

module.exports = SystematicExaminationModel;