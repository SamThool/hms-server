const IPDSubform = require("../../models/IPD/ipdsubform.model.js");
const IPDForm = require("../../models/IPD/ipdform.model.js");

const createSubform = async (req, res) => {
  try {
    const { subformName, formId, type } = req.body;

    if (!subformName || !formId) {
      return res
        .status(400)
        .json({ message: "subformName and formId are required" });
    }

    // Create subform
    const newSubform = new IPDSubform({ subformName, formId, type });
    await newSubform.save();

    // Push subform._id into IPDForm.subForms
    await IPDForm.findByIdAndUpdate(
      formId,
      { $push: { subForms: newSubform._id } },
      { new: true, useFindAndModify: false }
    );

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

    // Delete the subform
    const deletedSubform = await IPDSubform.findByIdAndDelete(id);

    if (!deletedSubform) {
      return res.status(404).json({ message: "Subform not found" });
    }

    // Remove the subform ID from the parent form's subForms array
    await IPDForm.findByIdAndUpdate(
      deletedSubform.formId,
      { $pull: { subForms: deletedSubform._id } },
      { new: true }
    );

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

    // 1. Get form with its subForms array
    const form = await IpdFormModel.findById(formId).populate("subForms");

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (!form.subForms || form.subForms.length === 0) {
      return res
        .status(404)
        .json({ message: "No subforms found for this formId" });
    }

    // 2. Preserve order of subForms as stored in the form
    const orderedSubforms = form.subForms.map((sf) => ({
      _id: sf._id,
      subformName: sf.subformName,
      // add other fields you need
    }));

    res.json({ subforms: orderedSubforms });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching subforms", error: error.message });
  }
};

// ✅ Add Image to Subform
const addImageToSubform = async (req, res) => {
  try {
    const { id } = req.params; // subform id
    const { imagename, image } = req.body; // image data

    if (!imagename || !image) {
      return res
        .status(400)
        .json({ message: "Both imagename and image are required" });
    }

    const updatedSubform = await IPDSubform.findByIdAndUpdate(
      id,
      { $push: { images: { imagename, image } } },
      { new: true }
    );

    if (!updatedSubform) {
      return res.status(404).json({ message: "Subform not found" });
    }

    res.json({
      message: "Image added successfully",
      subform: updatedSubform,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding image", error: error.message });
  }
};

const getImageToSubform = async (req, res) => {
  try {
    const subform = await IPDSubform.findById(req.params.id);
    if (!subform) return res.status(404).json({ message: "Subform not found" });
    res.json({ subform });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching images", error: err.message });
  }
};

const getColumns = async (req, res) => {
  try {
    const { subformId } = req.params;
    const subform = await IPDSubform.findById(subformId);

    if (!subform) return res.status(404).json({ message: "Subform not found" });

    res.json({ columns: subform.table || [] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching columns", error: error.message });
  }
};

const saveColumns = async (req, res) => {
  try {
    const { subformId } = req.params;
    const { columns } = req.body;
    // console.log("----------------------", columns);

    if (!Array.isArray(columns)) {
      return res.status(400).json({ message: "columns must be an array" });
    }

    const updatedColumns = columns.map((col) => {
      const columnData = {
        columnName: col.columnName || col.name,
        options: (col.options || []).map((opt) =>
          typeof opt === "string" ? opt : opt.optionName
        ),
      };
      if (col._id) columnData._id = col._id;
      return columnData;
    });

    const subform = await IPDSubform.findByIdAndUpdate(
      subformId,
      { table: updatedColumns },
      { new: true, runValidators: true }
    );

    if (!subform) {
      return res.status(404).json({ message: "Subform not found" });
    }

    res.json({ message: "Columns saved successfully", subform });
  } catch (error) {
    res.status(500).json({
      message: "Error saving columns",
      error: error.message,
    });
  }
};

module.exports = {
  createSubform,
  updateSubform,
  getImageToSubform,
  deleteSubform,
  getSubformsByFormId,
  addImageToSubform,
  saveColumns,
  getColumns,
};
