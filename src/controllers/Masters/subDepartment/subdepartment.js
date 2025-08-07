// controllers/subDepartment.controller.js
const SubDepartment = require("../../../models/Masters/subDepartment/subdepartment");

// GET all
exports.getAllSubDepartments = async (req, res) => {
  try {
    const allSubDepartments = await SubDepartment.find()
      .populate("departmentId", "departmentName")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: allSubDepartments });
  } catch (err) {
    console.error("Error fetching sub-departments:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};


// POST new
exports.createSubDepartment = async (req, res) => {
  try {
    const { name,departmentId } = req.body;

 

    if (!name)
      return res.status(400).json({ msg: "Sub Department name is required" });

    const existing = await SubDepartment.findOne({ name });
    if (existing)
      return res.status(400).json({ msg: "Sub Department already exists" });

    const newSubDept = new SubDepartment({ name ,departmentId });
    await newSubDept.save();
    res.status(201).json({ msg: "Sub Department created successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// PUT update
exports.updateSubDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name ,departmentId} = req.body;
    console.log("req.body in edit ", req.body);

    if (!name) return res.status(400).json({ msg: "Name is required" });

    const updated = await SubDepartment.findByIdAndUpdate(
      id,
      { name ,departmentId:departmentId},
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ msg: "Sub Department not found" });

    res.status(200).json({ msg: "Sub Department updated" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// DELETE
exports.deleteSubDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SubDepartment.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ msg: "Sub Department not found" });

    res.status(200).json({ msg: "Sub Department deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

exports.bulkImport = async (req, res) => {
  try {
    const subdepartment = req.body;
    const result = await SubDepartment.insertMany(subdepartment);
    res
      .status(200)
      .json({ msg: "Sub departments Added", data: result });
  } catch (error) {
    console.error(error);
    res
      .json({ error: "Internal server error" });
  }
};
