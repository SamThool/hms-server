const express = require('express')
const AdministrativeRouter = express.Router()
const { handleToken } = require('../../../utils/handleToken')
const { AdministrativeController } = require('../../../controllers')
const multer = require('multer')
const { Administrative } = require('../../../models')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/images')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})

console.log(__dirname)
const upload = multer({ storage })

AdministrativeRouter.post(
  '/basicDetails',
  upload.single('profilePhoto'),
  AdministrativeController.createBasicDetails
)

AdministrativeRouter.put(
  '/basicDetails/:id',
  upload.single('profilePhoto'),
  AdministrativeController.updateBasicDetails
)

AdministrativeRouter.put(
  '/pastEmploymentDetails/:id',
  AdministrativeController.updatePastEmploymentDetails
)

AdministrativeRouter.put(
  '/employmentDetails/:id',
  AdministrativeController.updateEmploymentDetails
)

AdministrativeRouter.put(
  '/documents/:id',
  upload.any(),
  AdministrativeController.updateDocuments
)

AdministrativeRouter.put(
  '/hrFinance/:id',
  upload.single('cancelCheck'),
  AdministrativeController.updateHrFinanceDetails
)

AdministrativeRouter.put(
  '/SalaryAndWages/:id',
  AdministrativeController.updateSalaryAndWagesDetails
)

AdministrativeRouter.put(
  '/systemRights/:id',
  AdministrativeController.updateSystemRights
)

AdministrativeRouter.get('/', AdministrativeController.getAllAdministrativeData)
// current logged-in user's profile
AdministrativeRouter.get('/me', handleToken, AdministrativeController.getMyAdministrativeProfile)
AdministrativeRouter.get('/:id', AdministrativeController.getAdministrativeById)
AdministrativeRouter.get(
  '/administrativeData/reportTo',
  AdministrativeController.getAdministrativeForReportTo
)
AdministrativeRouter.get(
  '/administrativeData/getEmployeeCode',
  AdministrativeController.generateEmpCode
)


AdministrativeRouter.put('/delete/:id', AdministrativeController.deleteAdministrative)

module.exports = AdministrativeRouter
