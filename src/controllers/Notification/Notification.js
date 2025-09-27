// notification.controller.js
const Notification = require("../../models/Notification/Notification");
const OpdPatientModel = require("../../models/appointment-confirm/opdPatient.model");
const {
  emitPatientApprovedRequest,
  emitPatientStatusUpdate,
} = require("../../utils/socket");

const createNotification = async (req, res) => {
  try {
    const { receiver } = req.body;
    console.log("Create Notification Is Running", req.body);
    const notification = await Notification.create(req.body);
    const dataForOpdPatient = await OpdPatientModel.findOneAndUpdate(
      { patientId: req.body.patientId },
      {
        $push: {
          notifications: notification._id, // Make sure this is a valid ObjectId
        },
      },
      { new: true }
    );
    emitPatientStatusUpdate(dataForOpdPatient);

    // Send real-time notification to the receiver
    const receiverSocketId = global.onlineUsers.get(receiver);

    if (receiverSocketId) {
      global.io.to(receiverSocketId).emit("new-notification", notification);
      console.log(`📢 Sent real-time notification to ${receiver}`);
    } else {
      console.log(`⚠️ Receiver ${receiver} is offline, skipping socket emit`);
    }

    res.status(201).json({ notification });
  } catch (error) {
    console.error("❌ Notification creation failed:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const { consultantId } = req.params;
    console.log(consultantId);
    if (!consultantId) {
      return res.status(400).json({ message: "Consultant ID is required" });
    }

    const notifications = await Notification.find({
      $or: [{ receiver: consultantId }, { patientId: consultantId }],
    }).populate({
      path: "sender",
      options: { sort: { createdAt: -1 } },
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNotificationsPatient = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const notifications = await Notification.find({ patientId: id }).populate({
      path: "sender",
      options: { sort: { createdAt: -1 } },
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNotificationStatus = async (req, res) => {
  try {
    const { id } = req.params; // notification ID
    if (!id) {
      return res.status(400).json({ message: "Notification ID is required." });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { $set: { isRead: true, isApproved: true, status: req.body.status } },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // 🔥 Emit to consultant
    const patientId = updatedNotification.patientId;
    const opdId = updatedNotification.opdId;
    const patientInfo = await OpdPatientModel.findOne({ patientId })
      .populate({
        path: "notifications",
        populate: {
          path: "sender",
          options: { sort: { createdAt: -1 } },
        },
      })
      .exec();

    const allNotificationOfPatient = await Notification.find({ opdId })
      .populate({
        path: "sender",
        options: { sort: { createdAt: -1 } },
      })
      .exec();

    emitPatientStatusUpdate(patientInfo);
    emitPatientApprovedRequest(patientInfo);

    res.status(200).json({
      message: "Notification updated successfully.",
      notification: updatedNotification,
      allNotificationOfPatient,
    });
  } catch (error) {
    console.error("❌ Failed to update notification:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  updateNotificationStatus,
  getNotificationsPatient,
};
