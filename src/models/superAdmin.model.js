const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false
});

const SuperAdminModel = mongoose.model('Super-Admin', superAdminSchema);
module.exports = SuperAdminModel;