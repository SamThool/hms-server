// controllers/ipdPatientEMRController.js
const { default: mongoose } = require("mongoose");
const IPDPatientEMR = require("../../models/IPD/IPDPatientEMR");

const addEMR = async (req, res) => {
  try {
    const { patientId, consultantName, consultantId, data, subFormId } =
      req.body;

    let patientEMR = await IPDPatientEMR.findOne({ patientId });

    // Create EMR object
    const newEMR = {
      consultantName,
      consultantId,
      data,
      subFormId,
      updatedAt: new Date(),
    };

    if (req.body?.image) {
      newEMR.image = req.body?.image; // add image only if it exists
    }

    if (!patientEMR) {
      // create new record for patient
      patientEMR = new IPDPatientEMR({
        patientId,
        EMR: [newEMR],
      });
    } else {
      // push into existing patient EMR array
      patientEMR.EMR.push(newEMR);
    }

    await patientEMR.save();

    res.status(200).json({ message: "EMR added successfully", patientEMR });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete EMR entry
const deleteEMR = async (req, res) => {
  try {
    const { patientId, emrId } = req.params;

    const patientEMR = await IPDPatientEMR.findOne({
      patientId: patientId,
    });
    if (!patientEMR)
      return res.status(404).json({ message: "Patient not found" });

    patientEMR.EMR = patientEMR.EMR.filter(
      (emr) => emr._id.toString() !== emrId
    );

    await patientEMR.save();

    res.status(200).json({ message: "EMR deleted successfully", patientEMR });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get EMR by Patient ID
const getEMRByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patientEMR = await IPDPatientEMR.findOne({
      patientId: patientId,
    });

    if (!patientEMR) {
      return res.status(404).json({ message: "No EMR found for this patient" });
    }

    res.status(200).json(patientEMR);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add Emoji for a patient
const addEmoji = async (req, res) => {
  try {
    const { patientId, emoji, label, consultantId, consultantName, subFormId } =
      req.body;

    if (!patientId || !emoji || !consultantId || !consultantName) {
      return res.status(400).json({
        message:
          "patientId, emoji, consultantId, and consultantName are required",
      });
    }

    // Find patient EMR
    let patientEMR = await IPDPatientEMR.findOne({ patientId });
    // Create emoji entry
    const newEmoji = {
      emoji,
      label: label || "",
      consultantId,
      consultantName,
      subFormId,
      createdAt: new Date(),
    };

    if (!patientEMR) {
      // create new record if patient doesn't exist
      patientEMR = new IPDPatientEMR({
        patientId,
        emojis: [newEmoji],
      });
    } else {
      // push emoji to existing patient
      patientEMR.emojis.push(newEmoji);
    }

    await patientEMR.save();

    res.status(200).json({ message: "Emoji added successfully", patientEMR });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get emojis of a patient by patientId
const getEmojisByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      return res.status(400).json({ message: "patientId is required" });
    }

    const patientEMR = await IPDPatientEMR.findOne({ patientId }).select(
      "emojis"
    );

    if (!patientEMR || !patientEMR.emojis || patientEMR.emojis.length === 0) {
      return res
        .status(404)
        .json({ message: "No emojis found for this patient" });
    }

    res.status(200).json({ emojis: patientEMR.emojis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/ipdPatientEMRController.js
const deleteEmoji = async (req, res) => {
  try {
    const { patientId, emojiId } = req.params;

    const patientEMR = await IPDPatientEMR.findOne({ patientId });
    if (!patientEMR)
      return res.status(404).json({ message: "Patient not found" });

    patientEMR.emojis = patientEMR.emojis.filter(
      (e) => e._id.toString() !== emojiId
    );

    await patientEMR.save();
    res.status(200).json({ message: "Emoji deleted successfully", patientEMR });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add paragraph
const addParagraph = async (req, res) => {
  try {
    const { patientId, text, consultantId, consultantName, subFormId } =
      req.body;
    if (!patientId || !text || !consultantId || !consultantName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let patientEMR = await IPDPatientEMR.findOne({ patientId });
    const newParagraph = {
      text,
      consultantId,
      consultantName,
      subFormId,
      createdAt: new Date(),
    };

    if (!patientEMR) {
      patientEMR = new IPDPatientEMR({ patientId, paragraphs: [newParagraph] });
    } else {
      patientEMR.paragraphs.push(newParagraph);
    }

    await patientEMR.save();
    res
      .status(200)
      .json({ message: "Paragraph added", paragraph: newParagraph });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get paragraphs
const getParagraphs = async (req, res) => {
  console.log("------------------------------------------------");
  try {
    const { patientId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ error: "Invalid patientId" });
    }

    const patientEMR = await IPDPatientEMR.findOne({
      patientId: new mongoose.Types.ObjectId(patientId),
    });
    res.status(200).json({ paragraphs: patientEMR?.paragraphs || [] });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: err.message });
  }
};

// Edit paragraph
const editParagraph = async (req, res) => {
  try {
    const { paragraphId } = req.params;
    const { text } = req.body;

    const patientEMR = await IPDPatientEMR.findOne({
      "paragraphs._id": paragraphId,
    });
    if (!patientEMR)
      return res.status(404).json({ message: "Paragraph not found" });

    const paragraph = patientEMR.paragraphs.id(paragraphId);
    paragraph.text = text;
    paragraph.updatedAt = new Date();

    await patientEMR.save();
    res.status(200).json({ message: "Paragraph updated", paragraph });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete paragraph
const deleteParagraph = async (req, res) => {
  try {
    const { paragraphId } = req.params;

    const patientEMR = await IPDPatientEMR.findOne({
      "paragraphs._id": paragraphId,
    });

    if (!patientEMR)
      return res.status(404).json({ message: "Paragraph not found" });
    patientEMR.paragraphs = patientEMR.paragraphs.filter(
      (p) => p._id.toString() !== paragraphId
    );

    await patientEMR.save();
    res.status(200).json({ message: "Paragraph deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Replace or save a table
const saveTable = async (req, res) => {
  try {
    const {
      patientId,
      tableId,
      consultantId,
      consultantName,
      subFormId,
      type,
      columns,
      rows,
    } = req.body;

    if (
      !patientId ||
      !consultantId ||
      !consultantName ||
      !type ||
      !columns ||
      !rows
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let patientEMR = await IPDPatientEMR.findOne({ patientId });

    const newTable = {
      _id: tableId || undefined, // keep existing _id if editing
      type, // "LTR" or "TTB"
      consultantId,
      consultantName,
      subFormId,
      columns,
      rows,
      createdAt: new Date(),
    };

    if (!patientEMR) {
      // create new patient EMR record
      patientEMR = new IPDPatientEMR({
        patientId,
        tables: [newTable],
      });
    } else {
      if (tableId) {
        // Replace existing table
        const tableIndex = patientEMR.tables.findIndex(
          (t) => t._id.toString() === tableId
        );
        if (tableIndex !== -1) {
          patientEMR.tables[tableIndex] = newTable;
        } else {
          // TableId not found, push as new table
          patientEMR.tables.push(newTable);
        }
      } else {
        // No tableId, push as new table
        patientEMR.tables.push(newTable);
      }
    }

    await patientEMR.save();

    res
      .status(200)
      .json({ message: "Table saved successfully", table: newTable });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all tables by patientId
const getTables = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patientEMR = await IPDPatientEMR.findOne({ patientId }).select(
      "tables"
    );

    if (!patientEMR || patientEMR.tables.length === 0) {
      return res
        .status(404)
        .json({ message: "No tables found for this patient" });
    }

    res.status(200).json({ tables: patientEMR.tables });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a table by Id
const deleteTable = async (req, res) => {
  try {
    const { patientId, tableId } = req.params;
    const patientEMR = await IPDPatientEMR.findOne({ patientId });

    if (!patientEMR)
      return res.status(404).json({ message: "Patient not found" });

    patientEMR.tables = patientEMR.tables.filter(
      (t) => t._id.toString() !== tableId
    );
    await patientEMR.save();

    res.status(200).json({ message: "Table deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addEMR,
  deleteEMR,
  getEMRByPatientId,
  addEmoji,
  getEmojisByPatientId,
  deleteEmoji,
  addParagraph,
  getParagraphs,
  editParagraph,
  deleteParagraph,
  saveTable,
  getTables,
  deleteTable,
};
