const mongoose = require("mongoose");
const generalExaminationObjective = new mongoose.Schema({
    name:String,
    answerType:String,
    objective:[this]
}, { _id: true, _id: true, timestamps: false })
generalExaminationObjective.add({objective:[generalExaminationObjective]})

const subDisoder = new mongoose.Schema({
        name: String,
            count: { type: Number, default: 0 },
            answerType: String,
            objective: [generalExaminationObjective],
}, { _id: true, _id: true, timestamps: false })
const GeneralExaminationSchema = new mongoose.Schema({
    exam: {
        disorder: String,
        subDisorder: [subDisoder],
        diagram:String,
    },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant' },
    delete: { type: Boolean, default: false }
}, { timestamps: true });

const GeneralExaminationModel = mongoose.model('General_Examination' , GeneralExaminationSchema);

module.exports = GeneralExaminationModel;