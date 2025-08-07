const mongoose = require('mongoose');

const adviceSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0,
    },
    advice: {
        type: String,
        required: false,
        unique: true
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Consultant'
    },
    delete: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
}, {
    versionKey: false,
    timestamps: true,
});

const adviceModel = mongoose.model('advice', adviceSchema);

module.exports = adviceModel;
