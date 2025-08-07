const express = require('express')
const LeaveManagerRouter = express.Router()
const { leaveManagerController } = require('../../../controllers')
const { handleToken } = require('../../../utils/handleToken')

LeaveManagerRouter.post('/', leaveManagerController.createLeaveManager)
LeaveManagerRouter.get('/', leaveManagerController.getAllLeaveManagers)
LeaveManagerRouter.put('/:id', leaveManagerController.updateLeaveManager)
LeaveManagerRouter.put('/delete/:id', leaveManagerController.deleteLeaveManager)

module.exports = LeaveManagerRouter
