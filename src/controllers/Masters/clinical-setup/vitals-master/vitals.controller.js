const VitalMasterModel = require("../../../../models/Masters/clinical-setup/vitals-master/vital.model");
const httpStatus = require("http-status");

// const createVitals = async (req, res) => {
//   try {
//     const { vital, age, group, unit, range } = req.body.inputData;
//     if ([vital, age, group, unit, range]?.some((item) => item?.trim() === "")) {
//       return res
//         .status(httpStatus.BAD_REQUEST)
//         .json({ error: "All fields is required" });
//     }

//     const isexists = await VitalMasterModel.findOne({ vital });

//     if (isexists) {
//       return res
//         .status(httpStatus.BAD_REQUEST)
//         .json({ error: "Vital already exists" });
//     }
//     console.log("is exists >>>>",isexists);
//     const newVital = new VitalMasterModel({
//       vital,
//       age,
//       group,
//       unit,
//       range,
//     });

//     await newVital.save();
//     res.status(httpStatus.CREATED).json({
//       message: "Vitals created successfully",
//       data: newVital,
//       success: true,
//     });
//   } catch (err) {
//     res
//       .status(httpStatus.INTERNAL_SERVER_ERROR)
//       .json({ message: "Error creating age group", error: err.message });
//   }
// };

const createVitals = async (req, res) => {
  try {
    const { vital, age, group, unit, range } = req.body.inputData || {};

    // 🔍 Basic validation
    const requiredFields = { vital, age, group, unit, range };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || typeof value !== "string" || value.trim() === "") {
        return res.status(httpStatus.BAD_REQUEST).json({
          error: `Field '${key}' is required and must be a non-empty string.`,
        });
      }
    }

    const trimmedVital = vital.trim();

    // 🔁 Check for existing vital (case-insensitive match recommended)
    const existingVital = await VitalMasterModel.findOne({
      vital: trimmedVital,
    });

    if (existingVital) {
      return res.status(httpStatus.CONFLICT).json({
        error: "Vital already exists",
      });
    }

    // ✅ Save the new vital
    const newVital = new VitalMasterModel({
      vital: trimmedVital,
      displayVital: trimmedVital,
      age: age.trim(),
      group: group.trim(),
      unit: unit.trim(),
      range: range.trim(),
    });

    await newVital.save();

    return res.status(httpStatus.CREATED).json({
      message: "Vital created successfully",
      data: newVital,
      success: true,
    });
  } catch (err) {
    // 🔐 Catch duplicate index error (in case of race conditions)
    if (err.code === 11000 && err.keyPattern?.vital) {
      return res.status(httpStatus.CONFLICT).json({
        error: "Vital name must be unique",
      });
    }

    // ❌ General error
    console.error("Error in createVitals:", err);

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Server error while creating vital",
      error: err.message,
    });
  }
};

const getAllVitals = async (req, res) => {
  try {
    const vitals = await VitalMasterModel.find({ delete: false });
    return res.status(httpStatus.OK).json({ data: vitals });
  } catch (err) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: err.message });
  }
};

const getSingleVital = async (req, res) => {
  try {
    const { id } = req.params;

    const vital = await VitalMasterModel.findById(id);

    console.log("vital:", vital);

    if (!vital) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Vital not found" });
    }

    return res.status(httpStatus.OK).json({ data: vital, success: true });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Error fetching vital",
      error: err.message,
    });
  }
};

const updateVitals = async (req, res) => {
  try {
    console.log("run put function");
    const { id } = req.params;
    const { vital, age, group, unit, range } = req.body?.inputData;

    const updateVitals = await VitalMasterModel.findByIdAndUpdate(
      id,
      { displayVital: vital, age, group, unit, range },
      { new: true, runValidators: true }
    );

    // const updateVitals = await VitalMasterModel.findByIdAndUpdate(
    //   id,
    //   { vital, displayVital: vital, age, group, unit, range },
    //   { new: true, runValidators: true }
    // );

    if (!updateVitals) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Vital group not found" });
    }

    res.status(httpStatus.OK).json({
      message: "Vitals  updated successfully",
      data: updateVitals,
      success: true,
    });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Error updating age group", error: err.message });
  }
};

// const deleteVitals = async (req, res) => {
//   try {
//     console.log("delete vitals>>>>")
//     const { id } = req.params;

//     const deleteVitals = await VitalMasterModel.findByIdAndUpdate(
//       { _id: id },
//       { ...req.body, delete: true, deletedAt: Date.now(), new: true }
//     );

//     if (!deleteVitals) {
//       return res
//         .status(httpStatus.NOT_FOUND)
//         .json({ message: "Vital not found" });
//     }

//     res.status(httpStatus.OK).json({
//       message: "Vital deleted successfully",
//       data: deleteVitals,
//       success: true,
//     });
//   } catch (err) {
//     res
//       .status(httpStatus.INTERNAL_SERVER_ERROR)
//       .json({ message: "Error deleting age group", error: err.message });
//   }
// };

const deleteVitals = async (req, res) => {
  try {
    console.log("run this console delete>>>");
    const { id } = req.params;

    const deletedVital = await VitalMasterModel.findByIdAndDelete(id);

    if (!deletedVital) {
      return res.status(404).json({ message: "Vital not found" });
    }

    res.status(200).json({
      message: "Vital permanently deleted",
      data: deletedVital,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting vital",
      error: err.message,
    });
  }
};

module.exports = {
  createVitals,
  getAllVitals,
  getSingleVital,
  updateVitals,
  deleteVitals,
};
