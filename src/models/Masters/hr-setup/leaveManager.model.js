const mongoose = require('mongoose')

const LeaveManagerSchema = new mongoose.Schema(
  {
    typeOfLeave: {
      type: mongoose.Types.ObjectId,
      ref: 'TypeOfLeaveMaster'
    },

    noOfLeaves: {
      type: Number,
      require: true,
      trim: true
    },

    delete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const LeaveManagerMasterModel = mongoose.model(
  'LeaveManagerMaster',
  LeaveManagerSchema
)

module.exports = LeaveManagerMasterModel
