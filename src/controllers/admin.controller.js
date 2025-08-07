const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ConsultantModel } = require("../models");
const { EmployeeModel } = require("../models");
const { AdminModel } = require("../models");
const { CompanySetupModel } = require("../models");
require("dotenv").config();
const httpStatus = require("http-status");
const { DepartmentSetupModel } = require("../models");

const {
  Administrative,
  NursingAndParamedical,
  MedicalOfficer,
  Support,
  Consultant,
} = require("../models");

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const domainRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && domainRegex.test(email);
}

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid email format!!" });
    }

    const existingAdmin = await AdminModel.findOne({ email: email });
    if (existingAdmin) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "User already exists!!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminModel({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    await newAdmin.save();
    res
      .status(httpStatus.CREATED)
      .json({ msg: "Admin registered successfully!!", admin: newAdmin });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
    console.log(error);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("kigub adnub,,,,,,");

    // Check if the admin exists
    const admin = await AdminModel.findOne({ email: email });
    console.log("admin", admin);
    if (!admin) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid email or password" });
    }

    // Check if the account is blocked
    if (admin.isBlocked) {
      return res
        .status(httpStatus.FORBIDDEN)
        .json({ msg: "Your account is blocked" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ msg: "Invalid email or password" });
    }

    const populatedUser = await AdminModel.findOne({ email: email }).populate({
      path: "refId",
      model: admin.refType,
      populate: [
        {
          path: "employmentDetails.departmentOrSpeciality",
          model: "DepartmentSetup",
        },
      ],
    });
    const token = jwt.sign(
      { adminId: admin._id, branchId: admin.refId },
      "Bearar"
    );

    const { departmentName, _id: departmentId } =
      populatedUser?.refId?.employmentDetails?.departmentOrSpeciality || {};

    const responseData = {
      msg: `Welcome ${admin.name}`,
      token: token,
      adminId: admin._id,
      Email: admin.email,
      Name: admin.name,
      role: admin.role,
      login: admin,
      departmentName: departmentName ? departmentName : "",
      departmentId: departmentId ? departmentId : "",
      empCode: populatedUser?.refId?.basicDetails?.empCode || "",
      systemRight: populatedUser?.refId?.systemRights || {},
    };

    res.status(httpStatus.OK).json(responseData);
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error", error: error });
    console.log(error);
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const user = await AdminModel.find({ isBlocked: false });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "No user found" });
    }
    res.status(httpStatus.OK).json({ user });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

const getAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await AdminModel.findById({ _id: id });
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "User not found" });
    }
    res.status(httpStatus.OK).json({ user: user });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await AdminModel.findByIdAndDelete({ _id: id });
    res.status(httpStatus.OK).json({ msg: "Admin deleted successfully" });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error" });
  }
};

const blockAdmin = async (req, res) => {
  console.log("hii");
};

const unblockAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await AdminModel.findOneAndUpdate(
      { email },
      { isBlocked: false, updatedAt: Date.now() }
    );
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Admin not found" });
    }
    res
      .status(httpStatus.OK)
      .json({ message: "Admin unblocked successfully", admin: user });
  } catch (error) {
    console.error(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
  }
};

const getBlockedAdmin = async (req, res) => {
  try {
    const blockedUsers = await AdminModel.find({ isBlocked: true });
    if (!blockedUsers) {
      return res.status(httpStatus.NOT_FOUND).json({ msg: "No user found" });
    }
    res.status(httpStatus.OK).json({ user: blockedUsers });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Something went wrong" });
    console.log(error);
  }
};

const getSystemRights = async (req, res) => {
  try {
    const { adminsRecordId } = req.params;

    // Find the admin record by ID
    const userFromAdminsRecord = await AdminModel.findOne({
      _id: adminsRecordId,
    });
    if (!userFromAdminsRecord) {
      return res.status(404).json({ error: "Admin record not found" });
    }

    // Populate the `refId` field dynamically using the `refType` as the model
    const populatedUser = await AdminModel.findOne({
      email: userFromAdminsRecord.email,
    }).populate({
      path: "refId",
      model: userFromAdminsRecord.refType, // Dynamically use the model
    });

    // Check if `refId` and `systemRights` exist
    const systemRights = populatedUser?.refId?.systemRights || {};

    // Send the system rights in the response
    return res.status(200).json({
      success: true,
      message: "System rights retrieved successfully",
      systemRights,
    });
  } catch (error) {
    console.error("Error fetching system rights:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

const fetchUserSuspensionStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by `refId`
    const user = await AdminModel.findOne({ refId: id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Extract suspension status
    const isSuspended = user.isBlocked;

    // Send the response
    return res.status(200).json({
      success: true,
      isSuspended,
    });
  } catch (error) {
    console.error("Error fetching user suspension status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateUserSuspensionStatus = async (req, res) => {
  try {
    const { userId, isSuspended } = req.body;

    // Validate input
    if (!userId || typeof isSuspended !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid input. userId and isSuspended are required.",
      });
    }

    // Find and update the user's suspension status
    const updatedUser = await AdminModel.findOneAndUpdate(
      { refId: userId },
      { isBlocked: isSuspended },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Respond with success and updated status
    return res.status(200).json({
      success: true,
      message: "Suspension status updated successfully.",
      isSuspended: updatedUser.isBlocked,
    });
  } catch (error) {
    console.error("Error updating suspension status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getSystemRightsById = async (req, res) => {
  console.log("getSystemRightsById called");
  try {
    const { id } = req.params;
    console.log("ID", id);
    // Find the admin record by ID
    const userFromAdminsRecord = await AdminModel.findOne({
      _id: id,
    });
    if (!userFromAdminsRecord) {
      return res.status(404).json({ error: "Admin record not found" });
    }

    // Populate the `refId` field dynamically using the `refType` as the model
    const populatedUser = await AdminModel.findOne({
      email: userFromAdminsRecord.email,
    }).populate({
      path: "refId",
      model: userFromAdminsRecord.refType, // Dynamically use the model
    });

    console.log("populatedUser", populatedUser);
    // Check if `refId` and `systemRights` exist
    const systemRights = populatedUser?.refId?.systemRights || {};

    // Send the system rights in the response
    return res.status(200).json({
      success: true,
      message: "System rights retrieved successfully",
      systemRights,
      populatedUser,
    });
  } catch (error) {
    console.error("Error fetching system rights:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAllAdmin,
  getAdmin,
  deleteAdmin,
  blockAdmin,
  unblockAdmin,
  getBlockedAdmin,
  getSystemRights,
  fetchUserSuspensionStatus,
  updateUserSuspensionStatus,
  getSystemRightsById,
};
