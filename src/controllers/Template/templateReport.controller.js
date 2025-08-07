const File = require("../../models/Masters/Template/file.model.js");

// Create Template
const createTemplateController = async (req, res) => {
  try {
    const { fileName, sectionContents, type } = req.body;
    if (!type) {
      return res
        .status(400)
        .json({ error: "Type (pathology or radiology) is required" });
    }

    const newFile = new File({
      fileName,
      sectionContents,
      type,
    });

    await newFile.save();
    res.status(201).json({ message: "File saved successfully", file: newFile });
  } catch (error) {
    console.error("Error in createTemplateController:", error);
    res.status(500).json({ error: "Failed to save file" });
  }
};

// Get Templates by type
const getTemplateController = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        error:
          "Type (pathology or radiology) is required getTemplateController",
      });
    }

    const files = await File.find({ type });
    res.status(200).json(files);
  } catch (error) {
    console.error("Error in getTemplateController:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};

// Update Template
const updateTemplateController = async (req, res) => {
  const { id } = req.params;
  const { fileName, sectionContents } = req.body;

  try {
    const updated = await File.findByIdAndUpdate(
      id,
      { fileName, sectionContents },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Template
const deleteTemplateController = async (req, res) => {
  try {
    const { id } = req.params;
    await File.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTemplateController,
  getTemplateController,
  updateTemplateController,
  deleteTemplateController,
};
