const mongoose = require("mongoose");

// Define a sub-schema for individual local/systematic examination entries
const ExaminationEntrySchema = new mongoose.Schema({
    disorder: {
        type: String,
        required: true // Assuming disorder is always present
    },
    subDisorder: {
        type: Array, // Array of sub-disorder objects
        of: { // Define the schema for elements in subDisorder array
            name: { type: String }
            // Add other properties of subDisorder if they exist, e.g., count: { type: Number }
        }
    },
    notes: {
        type: String
    },
    diagram: {
        type: String // This will now correctly store your Base64 image data
    },
    // If you have an _id for each entry in the array, Mongoose adds it by default
    // but you can explicitly define it if needed for referencing
    // _id: mongoose.Schema.Types.ObjectId
}, { _id: false }); // Set _id to false if you don't want Mongoose to automatically add _id to these sub-documents,
                    // otherwise, remove this line. If you need to reference them by _id from frontend, keep it true or remove.

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
        type: Array, // Assuming general might also need a sub-schema if it contains complex objects
        of: { // Example if general entries are also objects
            disorder: String,
            subDisorder: {
                type: Array,
                of: { name: String }
            },
            notes: String
        },
        default: []
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
