const mongoose = require("mongoose");
const localExaminationObjective = new mongoose.Schema({
    name:String,
    answerType:String,
    objective:[this]
}, { _id: true, _id: true, timestamps: false })
localExaminationObjective.add({objective:[localExaminationObjective]})
 
const subDisoder = new mongoose.Schema({
        name: String,
            count: { type: Number, default: 0 },
            answerType: String,
            objective: [localExaminationObjective],
}, { _id: true, _id: true, timestamps: false })
const LocalExaminationSchema = new mongoose.Schema({
    exam: {
        disorder: String,
        subDisorder: [{
            name: String,
            count: { type: Number, default: 0 },
            answerType: String,
            objective:[subDisoder],
        }],
        diagram:String,
    },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    consultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant' },
    delete: { type: Boolean, default: false }
}, { timestamps: true });

const LocalExaminationModel = mongoose.model('Local_Examination' , LocalExaminationSchema);

module.exports = LocalExaminationModel;