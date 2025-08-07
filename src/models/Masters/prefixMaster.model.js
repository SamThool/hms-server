const mongoose = require('mongoose');

const prefixSchema = new mongoose.Schema({
  prefix: {
    type: String,
    required: true,
    // unique:true
  },
  delete: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
}, 
{
timestamps: true,
versionKey: false
});


const Prefix = mongoose.model('Prefix', prefixSchema);

module.exports = Prefix;