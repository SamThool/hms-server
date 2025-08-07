const express = require('express');
const consultantsRouter = express.Router();
const consultantsController = require('../../../controllers/Satffs/consultants/consultants.controller');
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

// Step-wise doctor creation
consultantsRouter.post('/', upload.fields([
  { name: 'aadharCard', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'passbook', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'joining', maxCount: 1 },
  { name: 'revealing', maxCount: 1 },
  { name: 'SSC', maxCount: 1 },
  { name: 'HSC', maxCount: 1 },
  { name: 'graduation', maxCount: 1 },
  { name: 'postGraduation', maxCount: 1 },
  { name: 'other', maxCount: 1 },
  { name: 'sign', maxCount: 1 }
]), handleToken, consultantsController.createDoctorInSteps);

consultantsRouter.post('/import', handleToken, consultantsController.bulkImport);

consultantsRouter.get('/', handleToken, consultantsController.getAllConsultants);

consultantsRouter.get('/:id', handleToken, consultantsController.getConsultantById);
consultantsRouter.get('/department/:id', handleToken, consultantsController.getConsultantByDepartment);
consultantsRouter.put('/:id', handleToken, consultantsController.updateConsultantById);

consultantsRouter.put('/delete/:id', handleToken, consultantsController.markConsultantAsDeleted);
consultantsRouter.put('/system-right/:id', handleToken, consultantsController.createSystemRights);
consultantsRouter.put('/', upload.fields([
  { name: 'aadharCard', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'passbook', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'joining', maxCount: 1 },
  { name: 'revealing', maxCount: 1 },
  { name: 'SSC', maxCount: 1 },
  { name: 'HSC', maxCount: 1 },
  { name: 'graduation', maxCount: 1 },
  { name: 'postGraduation', maxCount: 1 },
  { name: 'other', maxCount: 1 },
  { name: 'sign', maxCount: 1 }
]), handleToken, consultantsController.updateUploadedDocuments);

module.exports = consultantsRouter;
