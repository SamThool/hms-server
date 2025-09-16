const IPDSubform = require("../../models/IPD/ipdsubform.model.js");

// ✅ Create a new Subform
const createSubform = async (req, res) => {
  try {
    const { subformName, formId } = req.body;

    if (!subformName || !formId) {
      return res
        .status(400)
        .json({ message: "subformName and formId are required" });
    }

    const newSubform = new IPDSubform({ subformName, formId });
    await newSubform.save();

    res
      .status(201)
      .json({ message: "Subform created successfully", subform: newSubform });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating subform", error: error.message });
  }
};

// ✅ Update Subform Name
const updateSubform = async (req, res) => {
  try {
    const { id } = req.params;
    const { subformName } = req.body;

    if (!subformName) {
      return res.status(400).json({ message: "subformName is required" });
    }

    const updatedSubform = await IPDSubform.findByIdAndUpdate(
      id,
      { subformName },
      { new: true }
    );

    if (!updatedSubform) {
      return res.status(404).json({ message: "Subform not found" });
    }

    res.json({
      message: "Subform updated successfully",
      subform: updatedSubform,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating subform", error: error.message });
  }
};

// ✅ Delete Subform
const deleteSubform = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSubform = await IPDSubform.findByIdAndDelete(id);

    if (!deletedSubform) {
      return res.status(404).json({ message: "Subform not found" });
    }

    res.json({ message: "Subform deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting subform", error: error.message });
  }
};

// ✅ Get All Subforms by formId
const getSubformsByFormId = async (req, res) => {
  try {
    const { formId } = req.params;

    const subforms = await IPDSubform.find({ formId });

    if (!subforms || subforms.length === 0) {
      return res
        .status(404)
        .json({ message: "No subforms found for this formId" });
    }

    res.json({ subforms });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subforms", error: error.message });
  }
};

module.exports = {
  createSubform,
  updateSubform,
  deleteSubform,
  getSubformsByFormId,
};
