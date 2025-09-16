const IPD_Layers = require("../../models/IPD/ipdlayers.model");
const IPDSubform = require("../../models/IPD/ipdsubform.model");

// Get all layers by subformId
exports.getLayersBySubform = async (req, res) => {
  try {
    const { subformId } = req.params;

    // Check if subform exists
    const subform = await IPDSubform.findById(subformId);
    if (!subform) {
      return res.status(404).json({ message: "IPD Subform not found" });
    }

    // Get all layers for this subform
    const layers = await IPD_Layers.find({ ipdSubformId: subformId });

    res.status(200).json({
      message: "Layers fetched successfully",
      data: layers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching layers",
      error: error.message,
    });
  }
};

// ✅ Create new IPD Layer (you already have this)
exports.createLayer = async (req, res) => {
  try {
    const { ipdSubformId, docName } = req.body;

    // Check if subform exists
    const subform = await IPDSubform.findById(ipdSubformId);
    if (!subform) {
      return res.status(404).json({ message: "IPD Subform not found" });
    }

    // Create new Layer
    const newLayer = await IPD_Layers.create({
      ipdSubformId,
      docName,
      questions: [], // start with empty questions
    });

    res.status(201).json({
      message: "IPD Layer created successfully",
      data: newLayer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating IPD Layer",
      error: error.message,
    });
  }
};

// ✅ Edit IPD Layer docName
exports.editLayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { docName } = req.body;

    const updatedLayer = await IPD_Layers.findByIdAndUpdate(
      id,
      { docName },
      { new: true }
    );

    if (!updatedLayer) {
      return res.status(404).json({ message: "IPD Layer not found" });
    }

    res.status(200).json({
      message: "IPD Layer updated successfully",
      data: updatedLayer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating IPD Layer",
      error: error.message,
    });
  }
};

// ✅ Delete IPD Layer
exports.deleteLayer = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLayer = await IPD_Layers.findByIdAndDelete(id);

    if (!deletedLayer) {
      return res.status(404).json({ message: "IPD Layer not found" });
    }

    res.status(200).json({
      message: "IPD Layer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting IPD Layer",
      error: error.message,
    });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const { layerId } = req.params;
    const { que, type } = req.body;

    // Validate input
    if (!que || !type) {
      return res
        .status(400)
        .json({ message: "Question text and type are required" });
    }

    const layer = await IPD_Layers.findById(layerId);
    if (!layer) {
      return res.status(404).json({ message: "IPD Layer not found" });
    }

    // Create question object
    const newQuestion = {
      que,
      type,
      children: [], // empty children by default
    };

    // Add to questions array
    layer.questions.push(newQuestion);
    await layer.save();

    // Return newly added question (last item in array)
    const addedQuestion = layer.questions[layer.questions.length - 1];

    res.status(201).json(addedQuestion);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error adding question", error: error.message });
  }
};

exports.addChildQuestion = async (req, res) => {
  try {
    const { layerId, questionId } = req.params;
    const { que, type } = req.body;

    if (!que || !type) {
      return res
        .status(400)
        .json({ message: "Question text and type are required" });
    }

    const layer = await IPD_Layers.findById(layerId);
    if (!layer) {
      return res.status(404).json({ message: "IPD Layer not found" });
    }

    // Recursive helper to find question by id
    const findQuestion = (questions, id) => {
      for (let q of questions) {
        if (q._id.toString() === id) return q;
        const found = findQuestion(q.children || [], id);
        if (found) return found;
      }
      return null;
    };

    const parentQuestion = findQuestion(layer.questions, questionId);
    if (!parentQuestion) {
      return res.status(404).json({ message: "Parent question not found" });
    }

    // Add child question
    const newQuestion = { que, type, children: [] };
    parentQuestion.children.push(newQuestion);

    await layer.save();

    const addedQuestion =
      parentQuestion.children[parentQuestion.children.length - 1];
    res.status(201).json(addedQuestion);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error adding child question", error: error.message });
  }
};

// helper: remove question recursively
const removeQuestionById = (questions, questionId) => {
  return questions.filter((q) => {
    if (q._id.toString() === questionId) {
      return false; // remove this one
    }
    q.children = removeQuestionById(q.children || [], questionId);
    return true;
  });
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { layerId, questionId } = req.params;
    const layer = await IPD_Layers.findById(layerId);
    if (!layer) return res.status(404).json({ message: "Layer not found" });

    layer.questions = removeQuestionById(layer.questions, questionId);
    await layer.save();

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting question", error: error.message });
  }
};

// ✅ Edit top-level question
exports.editQuestion = async (req, res) => {
  try {
    const { layerId, questionId } = req.params;
    const { que, type } = req.body;

    const layer = await IPD_Layers.findById(layerId);
    if (!layer) return res.status(404).json({ message: "Layer not found" });

    const question = layer.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (que) question.que = que;
    if (type) question.type = type;

    await layer.save();
    res.status(200).json({ message: "Question updated", data: question });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error editing question", error: error.message });
  }
};

// ✅ Edit child question
exports.editChildQuestion = async (req, res) => {
  try {
    const { layerId, parentId, questionId } = req.params;
    const { que, type } = req.body;

    const layer = await IPD_Layers.findById(layerId);
    if (!layer) return res.status(404).json({ message: "Layer not found" });

    // recursive helper
    const findQuestion = (questions, id) => {
      for (let q of questions) {
        if (q._id.toString() === id) return q;
        const found = findQuestion(q.children || [], id);
        if (found) return found;
      }
      return null;
    };

    const parent = findQuestion(layer.questions, parentId);
    if (!parent) {
      return res.status(404).json({ message: "Parent question not found" });
    }

    const child = parent.children.id(questionId);
    if (!child) {
      return res.status(404).json({ message: "Child question not found" });
    }

    if (que) child.que = que;
    if (type) child.type = type;

    await layer.save();
    res.status(200).json({ message: "Child question updated", data: child });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error editing child question", error: error.message });
  }
};
