const Section = require("../../models/Masters/Template/templateSection.model");

const CreateTemplateSectionController = async (req, res) => {
  try {
    const { section, sectionType } = req.body;

    if (!section || !sectionType) {
      return res
        .status(400)
        .json({ error: "Section and sectionType are required" });
    }

    const newFile = new Section({ section, sectionType });
    await newFile.save();
    res.status(201).json({ message: "aved successfully", file: newFile });
  } catch (error) {
    console.error("Error in CreateTemplateSectionController:", error);
    res.status(500).json({ error: "Failed to save file" });
  }
};

const GetTemplateSectionController = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { sectionType: type } : {};
    const files = await Section.find(query);
    res.status(200).json(files);
  } catch (error) {
    console.error("Error in GetTemplateRadiologyController:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};

const updateTemplateSectionController = async (req, res) => {
  const { id } = req.params;
  const { section, sectionType } = req.body;
  const updateData = {};

  if (section) updateData.section = section;
  if (sectionType) updateData.sectionType = sectionType;

  try {
    const updated = await Section.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTemplateSectionController = async (req, res) => {
  try {
    const { id } = req.params;
    await Section.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  CreateTemplateSectionController,
  GetTemplateSectionController,
  updateTemplateSectionController,
  deleteTemplateSectionController,
};
