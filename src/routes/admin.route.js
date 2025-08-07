const express = require('express');
const adminRouter = express.Router();
const { adminController } = require("../controllers")
const { validateAdminRegister, validateAdminLogin } = require('../validations/admin.validation');
const {handleToken} = require('../utils/handleToken'); 

adminRouter.get('/',handleToken, adminController.getAllAdmin);

adminRouter.post('/register', validateAdminRegister, adminController.registerAdmin);

adminRouter.post('/login', validateAdminLogin, adminController.loginAdmin);

adminRouter.get('/blocked',handleToken, adminController.getBlockedAdmin);

adminRouter.put('/block',handleToken, adminController.blockAdmin);

adminRouter.put('/unblock',handleToken, adminController.unblockAdmin);

adminRouter.get('/:id',handleToken, adminController.getAdmin);

adminRouter.delete('/:id', handleToken, adminController.deleteAdmin);

adminRouter.get('/user/system-rights/:adminsRecordId', adminController.getSystemRights)

adminRouter.get('/fetch-user-suspension-status/:id', handleToken, adminController.fetchUserSuspensionStatus)
adminRouter.post('/update-user-suspension-status', handleToken, adminController.updateUserSuspensionStatus)
adminRouter.get('/user-rights/:id', adminController.getSystemRightsById)

module.exports = adminRouter;