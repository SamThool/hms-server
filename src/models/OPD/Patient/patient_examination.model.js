const mongoose = require("mongoose");

// Sub-schema to capture sub-disorder details (supports objective nesting and subjective value)
const SubDisorderSchema = new mongoose.Schema(
    {
        name: { type: String },
        answerType: { type: String },
        // For subjective entries, store the typed value
        value: { type: String },
        // For objective entries, allow arbitrary nested arrays/objects (innerData/finalLayerData, etc.)
        objective: { type: Array, default: [] },
    },
    { _id: false }
);

// Define a sub-schema for individual local/systematic examination entries
const ExaminationEntrySchema = new mongoose.Schema(
    {
        disorder: {
            type: String,
            required: true,
        },
        // Use the richer sub-disorder schema so we can persist nested selections and values
        subDisorder: { type: [SubDisorderSchema], default: [] },
        notes: { type: String },
        diagram: { type: String }, // Base64 image data if present
    },
    { _id: false }
);

const PatientExaminationSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient_Appointment'
    },
    opdPatientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OPD_patient'
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'DepartmentSetup'
    },
    consultantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Consultant'
    },
    // Correct way to define an array of objects (sub-documents)
    local: {
        type: [ExaminationEntrySchema], // Array of ExaminationEntrySchema sub-documents
        default: [] // Initialize as an empty array
    },
    general: {
        // Align general with the same detailed structure used for local/systematic
        type: [
            new mongoose.Schema(
                {
                    disorder: String,
                    subDisorder: { type: [SubDisorderSchema], default: [] },
                    notes: String,
                    diagram: { type: String },
                },
                { _id: false }
            ),
        ],
        default: [],
    },
    // Correct way to define an array of objects (sub-documents)
    systematic: {
        type: [ExaminationEntrySchema], // Array of ExaminationEntrySchema sub-documents
        default: [] // Initialize as an empty array
    },
    other: {
        type: Array,
        of: { // Example if other entries are also objects
            exam: String,
            notes: String
        },
        default: []
    },
    delete: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false,
    timestamps: true,
});

const PatientExaminationModel = mongoose.model('Patient_Examination', PatientExaminationSchema);

module.exports = PatientExaminationModel;
