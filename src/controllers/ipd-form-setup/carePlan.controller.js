const httpStatus = require("http-status");
const CarePlanModel=require("../../models/Masters/ipd-form-setup/carePlan.model")
const mongoose = require('mongoose');

const createNursePlan = async (req, res) => {
  try {
    const newCarePlan = new CarePlanModel({ ...req.body });
    const savedCarePlan = await newCarePlan.save();
    res.status(httpStatus.CREATED).json({
      msg: "Create Plan Added Successfully ",
      data: savedCarePlan,
    });
  } catch (error) {
    console.error("Error storing Other History:", error);
    res.status(400).json({ error: error.message });
  }
};

const getAllCarePlan = async (req, res) => {
  try {
    const CarePlan = await CarePlanModel.find({ delete: false });
    res.status(httpStatus.OK).json({ data: CarePlan });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const GetMostUsedCarePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const CarePlan = await CarePlanModel.find({
      delete: false,
      departmentId: id,
    })
      .sort({ createdAt: -1 }) // Sort by count in descending order
      .limit(30); // Limit the response to 30 results
    res.status(httpStatus.OK).json({ data: CarePlan });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const updateOtherCarePlan = async (req, res) => {
  try {
    const CarePlan = await CarePlanModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res
      .status(httpStatus.OK)
      .json({ msg: "Care Plan Updated Successfully", CarePlan });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Care Plan Not Found", error });
  }
};

const deleteCarePlanByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        msg: "Invalid or missing IDs array",
        success: false
      });
    }
    
    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
        
    if (validIds.length === 0) {
      return res.status(400).json({
        msg: "No valid IDs provided",
        success: false
      });
    }
    
    const result = await CarePlanModel.deleteMany({
      _id: { $in: validIds },
      delete: false
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        msg: "No Care Plans found to delete",
        success: false
      });
    }
    
    res.status(200).json({
      msg: `${result.deletedCount} Care Plan(s) deleted successfully`,
      deletedCount: result.deletedCount,
      success: true
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      msg: "Error in deleting Care Plans",
      details: err.message,
      success: false
    });
  }
};

const deleteOtherCarePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { ids: selectedIndexes } = req.body;
    
    if (!selectedIndexes || !Array.isArray(selectedIndexes)) {
      return res.status(400).json({
        msg: "Invalid or missing indexes array",
        success: false
      });
    }
    
    const carePlan = await CarePlanModel.findById(id);
    
    if (!carePlan) {
      return res.status(404).json({
        msg: "Care Plan not found",
        success: false
      });
    }
    
    const sortedIndexes = selectedIndexes.sort((a, b) => b - a);
    
    sortedIndexes.forEach((index) => {
      if (index >= 0 && index < carePlan.objective.length) {
        carePlan.objective.splice(index, 1);
      }
    });
    
    carePlan.markModified("objective");
    await carePlan.save();
    
    res.status(200).json({
      msg: "Objective entries deleted successfully",
      updatedData: carePlan,
      success: true
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      msg: "Error deleting objective entries",
      details: err.message,
      success: false
    });
  }
};

const deleteOthersCarePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { objectiveIndex, innerDataIndex } = req.body;
    
    if (objectiveIndex === undefined || !Array.isArray(innerDataIndex)) {
      return res.status(400).json({
        msg: "Invalid request data",
        success: false
      });
    }
    
    const carePlan = await CarePlanModel.findById(id);
    
    if (!carePlan) {
      return res.status(404).json({
        msg: "Care Plan not found",
        success: false
      });
    }
    
    if (objectiveIndex < 0 || objectiveIndex >= carePlan.objective.length) {
      return res.status(400).json({
        msg: "Invalid objective index",
        success: false
      });
    }
    
    const objectiveItem = carePlan.objective[objectiveIndex];
    
    const sortedIndexes = innerDataIndex.sort((a, b) => b - a);
    
    sortedIndexes.forEach((index) => {
      if (index >= 0 && index < objectiveItem.innerData.length) {
        objectiveItem.innerData.splice(index, 1);
      }
    });
    
    carePlan.markModified("objective");
    await carePlan.save();
    
    res.status(200).json({
      msg: "InnerData entries deleted successfully",
      updatedData: carePlan,
      success: true
    });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({
      msg: "Error deleting innerData entries",
      details: err.message,
      success: false
    });
  }
};

const editCarePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { objectiveIndex, innerDataIndex, data } = req.body;

    if (
      typeof objectiveIndex !== "number" ||
      typeof innerDataIndex !== "number" ||
      !data
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid request data", success: false });
    }

    const carePlan= await CarePlanModel.findById(id);
    if (!carePlan) {
      return res
        .status(404)
        .json({ msg: "Care Plan not found", success: false });
    }

    if (objectiveIndex < 0 || objectiveIndex >= carePlan.objective.length) {
      return res
        .status(400)
        .json({ msg: "Invalid objective index", success: false });
    }

    const objectiveItem = carePlan.objective[objectiveIndex];

    if (
      !objectiveItem.innerData ||
      innerDataIndex < 0 ||
      innerDataIndex >= objectiveItem.innerData.length
    ) {
      return res
        .status(400)
        .json({ msg: "Invalid innerData index", success: false });
    }

    objectiveItem.innerData[innerDataIndex].data = data;

    carePlan.markModified("objective");

    await carePlan.save();

    res.status(200).json({
      msg: "InnerData entry updated successfully",
      updatedData:carePlan,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating innerData entry",
      details: err.message,
      success: false,
    });
  }
};

const updateOthersCarePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { index, data } = req.body;

    const carePlan = await CarePlanModel.findById(id);

    if (!carePlan) {
      return res.status(404).json({ msg: "Care Plan not found" });
    }

    if (typeof index !== "number" || !data) {
      return res
        .status(400)
        .json({ msg: "Invalid index or missing data field" });
    }

    if (index < 0 || index >= carePlan.objective.length) {
      return res.status(400).json({ msg: "Invalid objective index" });
    }

    carePlan.objective[index].data = data;

    carePlan.markModified("objective");

    await carePlan.save();

    res.status(200).json({
      msg: "Objective entry updated successfully",
      updatedData: carePlan,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error updating objective entry",
      details: err.message,
    });
  }
};

const updateCarePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { objective } = req.body;
    const carePlan = await CarePlanModel.findById(id);
    carePlan.objective.push(...objective);
    const newCarePlan = await carePlan.save();
    res.status(httpStatus.CREATED).json({
      msg: "Care Plan Updated Objective Successfully ",
      data: newCarePlan,
    });
  } catch (error) {
    console.error("Error storing Care Plan Objective:", error);
    res.status(400).json({ error: error.message });
  }
};
module.exports={createNursePlan,getAllCarePlan,GetMostUsedCarePlan,updateOtherCarePlan,deleteCarePlanByIds,
    deleteOtherCarePlan, deleteOthersCarePlan,editCarePlan,updateOthersCarePlan,updateCarePlan

}