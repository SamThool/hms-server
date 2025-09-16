const mongoose = require("mongoose");

const ipdFormSchema = new mongoose.Schema(
  {
    formName: {
      type: String,
      required: true,
      trim: true,
    },
    access: [
      {
        type: String, // or mongoose.Schema.Types.ObjectId if referencing Users/Roles
      },
    ],
    subForms: [
      {
        type: String, // or mongoose.Schema.Types.ObjectId if referencing other forms
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const IpdFormModel = mongoose.model("IpdForm", ipdFormSchema);
module.exports = IpdFormModel;
