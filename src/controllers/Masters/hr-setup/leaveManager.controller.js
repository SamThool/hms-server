const { LeaveManagerMasterModel } = require('../../../models') // Adjust the path as per your project structure

// Create a new leave manager entry
const createLeaveManager = async (req, res) => {
  try {
    const { inputData } = req.body

    if (!inputData || !inputData.typeOfLeave) {
      return res
        .status(400)
        .json({ success: false, message: 'Leave Type is required' })
    }

   

    const newLeaveManager = new LeaveManagerMasterModel(inputData)
    await newLeaveManager.save()

    res.status(201).json({
      success: true,
      message: 'Leave manager created successfully',
      data: newLeaveManager
    })
  } catch (error) {
    console.error('Error creating leave manager:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Fetch all leave managers
const getAllLeaveManagers = async (req, res) => {
    try {
      const leaveManagers = await LeaveManagerMasterModel.find({ delete: false })
        .populate({
          path: 'typeOfLeave', 
          select: 'typeOfLeave _id'
        })
  
      res.status(200).json({
        success: true,
        message: 'Leave managers fetched successfully',
        data: leaveManagers
      })
    } catch (error) {
      console.error('Error fetching leave managers:', error.message)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  }
  

// Update a specific leave manager
const updateLeaveManager = async (req, res) => {
  try {
    const { id } = req.params
    const { inputData } = req.body

    if (!inputData) {
      return res
        .status(400)
        .json({ success: false, message: 'Manager name is required' })
    }

    const updatedLeaveManager = await LeaveManagerMasterModel.findByIdAndUpdate(
      id,
      inputData,
      { new: true }
    )

    if (!updatedLeaveManager) {
      return res
        .status(404)
        .json({ success: false, message: 'Leave manager not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Leave manager updated successfully',
      data: updatedLeaveManager
    })
  } catch (error) {
    console.error('Error updating leave manager:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Soft delete a specific leave manager
const deleteLeaveManager = async (req, res) => {
  try {
    const { id } = req.params

    const deletedLeaveManager = await LeaveManagerMasterModel.findByIdAndUpdate(
      id,
      { delete: true },
      { new: true }
    )

    if (!deletedLeaveManager) {
      return res
        .status(404)
        .json({ success: false, message: 'Leave manager not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Leave manager deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting leave manager:', error.message)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Export all controllers
module.exports = {
  createLeaveManager,
  getAllLeaveManagers,
  updateLeaveManager,
  deleteLeaveManager
}
