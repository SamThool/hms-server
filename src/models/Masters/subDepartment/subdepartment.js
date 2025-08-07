const mongoose = require('mongoose');

const subDepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sub Department name is required'],
      trim: true,
      unique: true,
    },
     departmentId: {
         type: mongoose.Types.ObjectId,
         ref: "DepartmentSetup",
       },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SubDepartment', subDepartmentSchema);
