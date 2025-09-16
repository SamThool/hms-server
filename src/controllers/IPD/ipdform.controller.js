const IpdFormModel = require("../../models/IPD/ipdform.model");
const IPDSubform = require("../../models/IPD/ipdsubform.model.js");

// Add a new IPD Form
const addForm = async (req, res) => {
  try {
    const { formName, access, subForms } = req.body;

    if (!formName) {
      return res
        .status(400)
        .json({ success: false, message: "formName is required" });
    }

    const newForm = new IpdFormModel({
      formName,
      access: access || [],
      subForms: subForms || [],
    });

    await newForm.save();

    res.status(201).json({
      success: true,
      message: "IPD Form created successfully",
      data: newForm,
    });
  } catch (error) {
    console.error("Add IPD Form Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// // Get all IPD Forms
// const getAllForms = async (req, res) => {
//   try {
//     const forms = await IpdFormModel.find().sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       total: forms.length,
//       data: forms,
//     });
//   } catch (error) {
//     console.error("Get All IPD Forms Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

const getAllForms = async (req, res) => {
  try {
    // 1. Fetch all forms
    const forms = await IpdFormModel.find().sort({ createdAt: -1 });

    // 2. For each form, fetch related subforms
    const formsWithSubforms = await Promise.all(
      forms.map(async (form) => {
        const subForms = await IPDSubform.find({
          formId: form._id,
        }).select("_id subformName"); // adjust fields as needed
        return {
          ...form.toObject(), // convert Mongoose doc to plain object
          subForms, // attach the subforms array
        };
      })
    );

    // 3. Send response
    res.status(200).json({
      success: true,
      total: formsWithSubforms.length,
      data: formsWithSubforms,
    });
  } catch (error) {
    console.error("Get All IPD Forms Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete IPD Form by ID
const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedForm = await IpdFormModel.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({
        success: false,
        message: "IPD Form not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "IPD Form deleted successfully",
      data: deletedForm,
    });
  } catch (error) {
    console.error("Delete IPD Form Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { addForm, getAllForms, deleteForm };
