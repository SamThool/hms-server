const { CompanySetupModel } = require("../models");
const { AdminModel } = require("../models");
const { RoleModel } = require("../models");
require("dotenv").config();
const httpStatus = require("http-status");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Add Company Details
const addCompanyDetails = async (req, res) => {
  try {
    const {
      hospitalName,
      hospitalAddress,
      Pincode,
      City,
      District,
      State,
      email,
      website,
      mobileNumber,
      landlineNumber,
      hospitalRegistrationNumber,
      gst,
      isPharmacy,
      isPrimary,
      branchDetails,
      pharmacyDetail,
    } = req.body;

    // Check if email or mobile number already exists
    const existingSetupByEmail = await CompanySetupModel.findOne({ email });
    const existingSetupByMobile = await CompanySetupModel.findOne({
      mobileNumber,
    });

    if (existingSetupByEmail) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "The provided email address is already associated with another company. Please use a different email.",
      });
    }

    if (existingSetupByMobile) {
      return res.status(httpStatus.BAD_REQUEST).json({
        msg: "The provided mobile number is already in use. Please provide a different mobile number.",
      });
    }

    // If isPrimary is true, set other companies' isPrimary to false
    if (isPrimary === "true") {
      await CompanySetupModel.updateMany(
        { isPrimary: true },
        { $set: { isPrimary: false } }
      );
    }

    // Generate a unique password for the admin user
    const name = hospitalName;
    const username = hospitalName.substring(0, 2);
    const middleChars = mobileNumber.substring(4);
    const specialChar = "@";
    const generatedPassword = `${username}${specialChar}${middleChars}`;
    const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);

    // Handle pharmacyDetail
    let parsedPharmacyDetail = pharmacyDetail;
    if (typeof parsedPharmacyDetail === "string") {
      try {
        parsedPharmacyDetail = JSON.parse(parsedPharmacyDetail);
      } catch (e) {
        parsedPharmacyDetail = {};
      }
    }
    // Debug: Log incoming files for pharmacy logo
    if (req.files && req.files.logo) {
      console.log(
        "Pharmacy logo file(s) received:",
        req.files.logo.map((f) => ({
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
        }))
      );
    } else {
      console.log("No pharmacy logo file received");
    }
    // Handle logo upload for pharmacyDetail
    if (req.files && req.files.logo && req.files.logo[0]) {
      parsedPharmacyDetail.logo = {
        data: req.files.logo[0].buffer.toString("base64"),
        contentType: req.files.logo[0].mimetype,
      };
      console.log("Pharmacy logo processed and attached to pharmacyDetail");
    }

    // Create new company setup
    const newCompany = new CompanySetupModel({
      hospitalName,
      hospitalAddress,
      Pincode,
      City,
      District,
      State,
      email,
      website,
      mobileNumber,
      landlineNumber,
      hospitalRegistrationNumber,
      gst,
      isPharmacy: isPharmacy === "true",
      isPrimary: isPrimary === "true",
      branchDetails:
        typeof branchDetails === "string"
          ? JSON.parse(branchDetails)
          : branchDetails,
      pharmacyDetail: parsedPharmacyDetail,
    });

    // Handling file uploads (hospitalLogo, headerImage)
    if (req.files) {
      if (req.files.hospitalLogo) {
        newCompany.hospitalLogo = {
          data: req.files.hospitalLogo[0].buffer.toString("base64"),
          contentType: req.files.hospitalLogo[0].mimetype,
        };
      }

      if (req.files.headerImage) {
        newCompany.headerImage = {
          data: req.files.headerImage[0].buffer.toString("base64"),
          contentType: req.files.headerImage[0].mimetype,
        };
      }
    }

    await newCompany.save();

    // Create Admin User
    const role = "admin";
    const Roles = await RoleModel.findOne({ name: role });
    const newUser = new AdminModel({
      name,
      email,
      password: hashedPassword,
      refId: newCompany._id,
      role: role,
      roleId: Roles._id,
    });

    await newUser.save();

    res.status(httpStatus.CREATED).json({
      msg: "Company registered successfully. Admin user created.",
      company_details: newCompany,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      msg: "An unexpected error occurred while saving company details. Please try again later.",
    });
  }
};

// Get Company Setup Details
const getCompanySetupDetails = async (req, res) => {
  console.log(req.files);
  try {
    const data = await CompanySetupModel.find();
    if (data.length === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ msg: "No Details Found!" });
    }
    res.status(httpStatus.OK).json({ data });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ msg: "Server error!" });
    console.log(error);
  }
};

// Update Company Setup Details
const updateCompanySetupDetails = async (req, res) => {
  try {
    const {
      hospitalName,
      hospitalAddress,
      Pincode,
      City,
      District,
      State,
      email,
      website,
      hospitalRegistrationNumber,
      mobileNumber,
      landlineNumber,
      gst,
      isPharmacy,
      isPrimary,
      branchDetails,
      pharmacyDetail,
    } = req.body;

    const { id } = req.params;

    console.log(pharmacyDetail);

    // Handle pharmacyDetail
    let parsedPharmacyDetail = pharmacyDetail;
    if (typeof parsedPharmacyDetail === "string") {
      try {
        parsedPharmacyDetail = JSON.parse(parsedPharmacyDetail);
      } catch (e) {
        parsedPharmacyDetail = {};
      }
    }
    // Debug: Log incoming files for pharmacy logo
    if (req.files && req.files.logo) {
      console.log(
        "Pharmacy logo file(s) received:",
        req.files.logo.map((f) => ({
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
        }))
      );
    } else {
      console.log("No pharmacy logo file received");
    }
    // Handle logo upload for pharmacyDetail
    if (req.files && req.files.logo && req.files.logo[0]) {
      parsedPharmacyDetail.logo = {
        data: req.files.logo[0].buffer.toString("base64"),
        contentType: req.files.logo[0].mimetype,
      };
      console.log("Pharmacy logo processed and attached to pharmacyDetail");
    }

    let updateData = {
      hospitalName,
      hospitalAddress,
      Pincode,
      City,
      District,
      State,
      email,
      website,
      mobileNumber,
      hospitalRegistrationNumber,
      landlineNumber,
      gst,
      isPharmacy: isPharmacy === "true",
      isPrimary: isPrimary === "true",
      branchDetails:
        typeof branchDetails === "string"
          ? JSON.parse(branchDetails)
          : branchDetails,
      pharmacyDetail: parsedPharmacyDetail,
      updatedAt: Date.now(),
    };

    // If current setup is set as primary, unset all others
    if (isPrimary === "true") {
      await CompanySetupModel.updateMany(
        { isPrimary: true },
        { $set: { isPrimary: false } }
      );
    }

    // Handle file uploads safely
    if (req.files) {
      if (req.files.hospitalLogo && req.files.hospitalLogo[0]) {
        updateData.hospitalLogo = {
          data: req.files.hospitalLogo[0].buffer.toString("base64"),
          contentType: req.files.hospitalLogo[0].mimetype,
        };
      }

      if (req.files.headerImage && req.files.headerImage[0]) {
        updateData.headerImage = {
          data: req.files.headerImage[0].buffer.toString("base64"),
          contentType: req.files.headerImage[0].mimetype,
        };
      }
    }

    const updateDetail = await CompanySetupModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return res.status(httpStatus.OK).json({
      success: true,
      msg: "Company details have been updated successfully.",
      updateDetail,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "An unexpected error occurred while updating company details. Please try again later.",
    });
  }
};

module.exports = {
  addCompanyDetails,
  getCompanySetupDetails,
  updateCompanySetupDetails,
};
