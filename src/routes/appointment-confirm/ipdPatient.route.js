const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  CreateRegistrationDetail,
  dischargePatient,
  transferPatient,
  getAllRegisteration,
  updateRegistation,
  findBedPatient,
  getUhidAndRegNo,
} = require("../../controllers/appointment-confirm/ipdPatient.controller");
const { CategoryMasterModel } = require("../../models");
const RoomTypeModel = require("../../models/Manage Room/roomType.model");
const RoomNoMasterModel = require("../../models/Manage Room/roomNo.model");
const BedMasterModel = require("../../models/Manage Room/bedMaster.model");

const IPDPatientRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, JPG, and PDF are allowed.")
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});

IPDPatientRouter.post(
  "/",
  upload.fields([
    { name: "aadhar_card", maxCount: 1 },
    { name: "abha_card", maxCount: 1 },
  ]),
  (req, res, next) => {
    try {
      CreateRegistrationDetail(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

IPDPatientRouter.get("/", getAllRegisteration);
IPDPatientRouter.get("/ipd-uhid-reg", getUhidAndRegNo);

IPDPatientRouter.put(
  "/:id",
  upload.fields([
    { name: "aadhar_card", maxCount: 1 },
    { name: "abha_card", maxCount: 1 },
  ]),
  (req, res, next) => {
    try {
      updateRegistation(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);

IPDPatientRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
});

IPDPatientRouter.get("/room-category", async (req, res) => {
  try {
    const categories = await CategoryMasterModel.find({ delete: false });
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

IPDPatientRouter.get("/room-type", async (req, res) => {
  try {
    const { category } = req.query;
    const categories = await RoomTypeModel.find({
      delete: false,
      categoryName: { $regex: category || "", $options: "i" },
    });
    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

IPDPatientRouter.get("/room-bed", async (req, res) => {
  try {
    const { category, type } = req.query;

    if (!category || !type) {
      return res
        .status(400)
        .json({ success: false, error: "Category and type are required" });
    }

    const finalArray = [];

    const roomIds = await RoomTypeModel.find({
      categoryName: category,
      roomType: type,
      delete: false,
    });

    // const roomIds = rooms.map((room) => room._id);

    if (roomIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    for (const roomId of roomIds) {
      const roomNoIds = await RoomNoMasterModel.find({
        roomTypeId: roomId?._id,
        delete: false,
      });

      // const roomNoIds = roomNos.map((roomNo) => roomNo._id);

      for (const roomNoId of roomNoIds) {
        const beds = await BedMasterModel.find({
          roomNameId: roomNoId?._id,
          delete: false,
        });

        for (const bed of beds) {
          for (let i = 0; i < bed.totalBeds.length; i++) {
            const obj = {
              bedName: bed.totalBeds[i],
              bedMasterId: bed._id,
              RoomName: bed.roomName,
              RoomId: bed.roomNameId,
              FloorName: roomId.floorNumber,
              RoomType: roomNoId.roomType, // leave as is
              RoomTypeId: roomNoId._id, // leave as is
              CategoryName: roomId.categoryName, // leave as is
            };
            finalArray.push(obj);
          }
        }
      }
    }

    return res.status(200).json({ success: true, data: finalArray });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

IPDPatientRouter.get("/findBedPatient/:bedMasterId/:bedName", findBedPatient);

IPDPatientRouter.post("/Discharge/:id", dischargePatient);

IPDPatientRouter.post("/transfer/:id", transferPatient);

module.exports = IPDPatientRouter;
