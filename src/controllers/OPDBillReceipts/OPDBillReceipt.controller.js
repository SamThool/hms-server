const {
  OPDReceiptModel,
  OPDReceiptNoModel,
  OPDTokenNoModel,
  AdminModel,
} = require("../../models");
const OpdPatientModel = require("../../models/appointment-confirm/opdPatient.model");
const PatientAppointment = require("../../models/Masters/patientAppointment.model");
const { AppointmentSchedulingModel } = require("../../models");
const { emitPatientStatusUpdate } = require("../../utils/socket");
const { default: mongoose } = require("mongoose");
const Notification = require("../../models/Notification/Notification");

const incrementOPDReceiptNo = async () => {
  try {
    let latestReceipt = await OPDReceiptNoModel.findOne();

    if (!latestReceipt) {
      console.error("No receipt found to increment");
      return;
    }

    // Extract the numeric part, increment it, and format it back
    const currentNumber = parseInt(
      latestReceipt.receiptNo.replace("REC", ""),
      10
    );
    const nextNumber = currentNumber + 1;
    const newReceiptNo = `REC${nextNumber.toString().padStart(4, "0")}`;

    // Update the existing record with the new receipt number
    latestReceipt.receiptNo = newReceiptNo;
    await latestReceipt.save();
  } catch (error) {
    console.error("Error incrementing OPD receipt number:", error);
  }
};

const getLatestTokenNumberAndAssignToPatient = async (
  consultantId,
  opdPatientId
) => {
  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  // Check if the consultant's record exists
  let tokenDoc = await OPDTokenNoModel.findOne({ consultantId });

  if (tokenDoc) {
    // If the record exists, check if it's for today
    if (tokenDoc.date === today) {
      // If today's record exists, increment the token number
      tokenDoc.currentTokenNumber += 1;
    } else {
      // If the date is different, reset the token number and update the date
      tokenDoc.date = today;
      tokenDoc.currentTokenNumber = 1;
    }
  } else {
    // If no record exists, create a new one
    tokenDoc = new OPDTokenNoModel({
      consultantId,
      date: today,
      currentTokenNumber: 1,
    });
  }

  // Save the updated or new token document
  const savedToken = await tokenDoc.save();

  // Assign the generated token number to the patient
  await OpdPatientModel.findByIdAndUpdate(
    opdPatientId,
    { tokenNo: savedToken.currentTokenNumber },
    { new: true }
  );
};

const createOPDReceipt = async (req, res) => {
  try {
    const { opdId, patientId, notification } = req.body;

    // Validate OPD and Patient existence
    const opd = await OpdPatientModel.findById(opdId);
    if (!opd) return res.status(404).json({ error: "OPD not found" });

    const patient = await PatientAppointment.findById(patientId);
    if (!patient)
      return res
        .status(404)
        .json({ error: "Patient Appointment not found in createOPDReceipt" });

    if (Array.isArray(notification)) {
      req.body.notifications = notification.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
    } else {
      req.body.notifications = [];
    }

    // Fetch or initialize receipt number
    let latestReceipt = await OPDReceiptNoModel.findOne();
    if (!latestReceipt)
      latestReceipt = await OPDReceiptNoModel.create({ receiptNo: "REC0001" });

    // Assign receipt number
    req.body.receiptNo = latestReceipt.receiptNo;

    const loggedInUserId = req.user.adminId;
    const loggedInUserData = await AdminModel.findOne({ _id: loggedInUserId });
    // console.log(loggedInUserData);
    // console.log("🧾 loggedInUserData:", loggedInUserData);

    if (Object.keys(loggedInUserData).length > 0) {
      (req.body.personWhoCreatedThisBillName = loggedInUserData.name || ""),
        (req.body.personWhoCreatedThisBillId = loggedInUserData.refId || null),
        (req.body.personWhoCreatedThisBillRefType =
          loggedInUserData.refType || "");
      req.body.employeeCode = loggedInUserData.empCode || "";
    }

    // Handle cheque fields
    // Handle cheque fields
    // Handle cheque fields
    if (req.body.paymentMode?.toLowerCase()?.trim() === "cheque") {
      req.body.chequeNumber = req.body.chequeNumber || null;
      req.body.chequeDate = req.body.chequeDate || null;
      req.body.chequeBank = req.body.chequeBank || null;
      req.body.chequeAmount = req.body.paidAmount || 0;
    }

    const paymentMode = req.body.paymentMode?.toLowerCase()?.trim();

    // ✅ Save common transaction ID field for multiple modes
    if (
      ["imps", "rtgs", "credit card", "debit card", "upi"].includes(paymentMode)
    ) {
      req.body.transactionId =
        req.body.transactionId ||
        req.body.utrNumber ||
        req.body.chequeNumber ||
        null;
    }

    // ✅ Save UTR specifically for NEFT
    if (paymentMode === "neft") {
      req.body.utrNumber = req.body.utrNumber || null;
    }

    // ✅ Handle UPI UTR saving
    if (req.body.paymentMode?.toLowerCase()?.trim() === "neft") {
      req.body.utrNumber = req.body.utrNumber || null;
    }

    // Create and save new receipt
    const newReceipt = new OPDReceiptModel(req.body);
    console.log("hello " + req.body);
    await newReceipt.save();

    // Increment the receipt number
    await incrementOPDReceiptNo();

    // Update OPD and Patient models
    const opdPatientDetails = await OpdPatientModel.findByIdAndUpdate(opdId, {
      isPatientPaidTheBill: true,
      billingStatus: "Paid",
    });

    await PatientAppointment.findByIdAndUpdate(patientId, { isConfirm: true });

    if (!opd.isPatientPaidTheBill && !opd.tokenNo) {
      await getLatestTokenNumberAndAssignToPatient(opd.consultantId, opdId);
    }

    //mark slot book and paid

    // Find the doctor's schedule
    const ScheduleOfDoctor = await AppointmentSchedulingModel.findOne({
      doctorId: opdPatientDetails.consultantId,
    });

    if (!ScheduleOfDoctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor schedule not found" });
    }

    // Find the specific day's schedule
    const getPerticularDaySchedule = ScheduleOfDoctor.schedule.find(
      (item) => item.date === opdPatientDetails.date
    );

    if (!getPerticularDaySchedule) {
      return res
        .status(404)
        .json({ success: false, message: "Day schedule not found" });
    }

    // Function to update the time slot status
    const updateTimeSlotStatus = (slot, time) => {
      const timeSlot = slot.timeSlotsIntervalWise.find(
        (ts) => ts.time === time
      );

      if (timeSlot) {
        timeSlot.booked = true;
        timeSlot.status = "BOOKED AND PAID";
      }
    };

    const appointmentTime = opdPatientDetails.time; // Assuming this is in the format "HH:MM AM/PM"
    updateTimeSlotStatus(getPerticularDaySchedule.slotA, appointmentTime);
    updateTimeSlotStatus(getPerticularDaySchedule.slotB, appointmentTime);

    // Mark the schedule as modified
    ScheduleOfDoctor.markModified("schedule");

    // Save the updated schedule back to the database
    await ScheduleOfDoctor.save();
    // console.log("Schedule updated successfully", newReceipt);
    if (
      newReceipt?.paymentMode?.toLowerCase()?.trim() === "cash" ||
      "charity"
    ) {
      emitPatientStatusUpdate(newReceipt);
    }

    console.log("-------------------------------------------------", req.body);

    if (req?.body?.services?.[0]?.serviceCode) {
      const id = req.body.services[0].serviceCode;
      try {
        await Notification.findByIdAndUpdate(id, { status: "PAID" });
      } catch (error) {
        console.warn(
          `Failed to update notification ${id} to PAID:`,
          error.message
        );
        // Continue without interrupting the flow
      }
    }

    return res.status(200).json({
      success: true,
      message: "Receipt Generated Successfully",
      receipt: newReceipt,
    });
  } catch (error) {
    console.error("Error creating OPD receipt:", error);
    res.status(500).json({ msg: "Internal server error", error });
  }
};

const getLatestOPDReceiptNo = async (req, res) => {
  try {
    let latestReceipt = await OPDReceiptNoModel.findOne();

    if (!latestReceipt) {
      // If no receipt exists, create the first one
      latestReceipt = await OPDReceiptNoModel.create({ receiptNo: "REC0001" });
    }

    return res.status(200).json({
      success: true,
      message: "OPD Receipt No fetched successfully",
      receiptNo: latestReceipt.receiptNo,
    });
  } catch (error) {
    console.error("Error fetching OPD receipt number:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getAllGeneratedReceiptsAgainstOPDPatient = async (req, res) => {
  const { id } = req.params;
  const receipts = await OPDReceiptModel.find({ opdId: id }).lean();
  return res.status(200).json({
    success: true,
    message: "Receipts found successfully",
    receipts: receipts,
  });
};

const getAllOpdReceiptsCurrentDate = async (req, res) => {
  try {
    // Get today's start and end time
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch receipts created today
    const receipts = await OPDReceiptModel.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay }, // ✅ FIXED: Added createdAt
    }).lean();

    // Categorize receipts by payment mode
    const filtered = receipts?.reduce(
      (acc, data) => {
        if (data?.paymentMode?.toLowerCase()?.trim() === "cash") {
          acc.cash.push(data);
        } else {
          acc.credit.push(data);
        }
        return acc;
      },
      { cash: [], credit: [] }
    );

    // Calculate total revenue separately
    const totalRevenue = receipts?.reduce(
      (sum, data) => sum + (Number(data?.paidAmount) || 0),
      0
    );

    return res.status(200).json({
      success: true,
      message: "Receipts found successfully",
      receipts,
      data: filtered,
      totalRevenue,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getAllReceipts = async (req, res) => {
  const receipts = await OPDReceiptModel.find();
  return res.status(200).json({
    success: true,
    message: "Receipts found successfully",
    receipts: receipts,
  });
};

const addDiscountToReceipt = async (req, res) => {
  try {
    const { receiptId } = req.params;
    const { discountCharges, discountStatus = "pending" } = req.body;

    if (!discountCharges || discountCharges < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid discount amount" });
    }

    const receipt = await OPDReceiptModel.findById(receiptId);

    if (!receipt) {
      return res
        .status(404)
        .json({ success: false, message: "Receipt not found" });
    }

    receipt.discountCharges = discountCharges;
    receipt.finalAmount = Math.max(receipt.totalAmount - discountCharges, 0);
    receipt.discountStatus = discountStatus;

    await receipt.save();

    return res.status(200).json({
      success: true,
      message: "Discount added to receipt successfully",
      updatedReceipt: receipt,
    });
  } catch (error) {
    console.error("Error updating discount:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const updateDiscountStatus = async (req, res) => {
  try {
    const { receiptId } = req.params;
    const { status } = req.body;

    if (!["pending", "approved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount status. Allowed: 'pending', 'approved'",
      });
    }

    const receipt = await OPDReceiptModel.findById(receiptId);
    if (!receipt) {
      return res
        .status(404)
        .json({ success: false, message: "Receipt not found" });
    }

    receipt.discountStatus = status;
    await receipt.save();

    return res.status(200).json({
      success: true,
      message: "Discount status updated successfully",
      updatedReceipt: receipt,
    });
  } catch (error) {
    console.error("Error updating discount status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  getAllReceipts,
  updateDiscountStatus,
  addDiscountToReceipt,
  createOPDReceipt,
  getLatestOPDReceiptNo,
  incrementOPDReceiptNo,
  getAllGeneratedReceiptsAgainstOPDPatient,
  getAllOpdReceiptsCurrentDate,
};
