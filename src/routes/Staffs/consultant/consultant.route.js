const express = require('express');
const consultantRouter = express.Router();
const consultantController = require('../../../controllers/Satffs/consultant/consultant.controller');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const { handleToken } = require('../../../utils/handleToken');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/images');
  },
  filename: function (req, file, cb) {
    const uniqueFileName = `${file.fieldname}-${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });


// Only include salary and wages and related endpoints
consultantRouter.put('/SalaryAndWages/:id', handleToken, consultantController.updateSalaryAndWages);

module.exports = consultantRouter;