const { Administrative, AdminModel } = require('../../../models')
const { SaveCredentials } = require('../HelperFunctions/SavedCredential')
const checkDuplicateFields = require('../HelperFunctions/CheckDuplicateEntries')
const { CompanySetupModel } = require('../../../models')

const createBasicDetails = async (req, res) => {
  try {
    const { contactNumber, email, adharNumber } = req.body

    // Check for duplicates
    const errorMessage = await checkDuplicateFields(Administrative, {
      contactNumber,
      email,
      adharNumber
    })

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      })
    }

    // Prepare basic details
    const basicDetails = {
      ...req.body,
      profilePhoto: req.file ? req.file.filename : null
    }

    // Create new basic details entry
    const newBasicDetails = new Administrative({
      basicDetails: basicDetails
    })

    // Save basic details in the database
    const savedBasicDetails = await newBasicDetails.save()

    // Create user credentials
    const CreateUserCredentials = await SaveCredentials(
      savedBasicDetails,
      'Administrative',
      'Administrative'
    )

    if (!CreateUserCredentials) {
      // Rollback saved basic details if credential creation fails
      await Administrative.findByIdAndDelete(savedBasicDetails._id)

      return res.status(500).json({
        success: false,
        message: 'Failed to create user credentials. Rolled back basic details.'
      })
    }

    // Return success response
    res.status(201).json({
      success: true,
      data: savedBasicDetails,
      message: 'Basic details created and credentials saved successfully.'
    })
  } catch (error) {
    console.error('Error creating basic details:', error)

    // Return error response
    res.status(500).json({
      success: false,
      message: 'Failed to create basic details.',
      error: error.message
    })
  }
}

const updateBasicDetails = async (req, res) => {
  const { id } = req.params

  try {
    const existingBasicDetails = await Administrative.findById(id)

    if (!existingBasicDetails) {
      return res.status(404).json({
        success: false,
        message: 'Basic details not found.'
      })
    }

    const basicDetails = {
      ...req.body,
      profilePhoto: req.file
        ? req.file.filename
        : existingBasicDetails.basicDetails.profilePhoto
    }

    const updatedDocument = await Administrative.findByIdAndUpdate(
      id,
      { $set: { basicDetails: basicDetails } },
      { new: true }
    )

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: 'No document found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Basic details updated successfully',
      data: updatedDocument
    })
  } catch (error) {
    console.error('Error updating basic details:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update basic details.',
      error: error.message
    })
  }
}

const updatePastEmploymentDetails = async (req, res) => {
  const { id } = req.params
  const { pastEmploymentData } = req.body

  try {
    const updatedDocument = await Administrative.findByIdAndUpdate(
      id,
      { $set: { pastEmploymentDetails: pastEmploymentData } },
      { new: true }
    )

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      })
    }

    res.status(200).json({
      success: true,
      data: updatedDocument,
      message: 'Past employment details updated '
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update the past employement details',
      error: error.message
    })
  }
}

const updateEmploymentDetails = async (req, res) => {
  const { id } = req.params
  const { employmentDetails } = req.body

  if (Object.keys(employmentDetails).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please fill the data'
    })
  }

  // Fields that require ObjectId
  const objectIdFields = [
    'departmentOrSpeciality',
    'empRole',
    'designation',
    'reportTo'
  ]

  // Preprocess employmentDetails to replace empty strings with null only for specific fields
  const sanitizedEmploymentDetails = { ...employmentDetails }

  objectIdFields.forEach(field => {
    if (sanitizedEmploymentDetails[field] === '') {
      sanitizedEmploymentDetails[field] = null
    }
  })

  try {
    const updatedDocument = await Administrative.findByIdAndUpdate(
      id,
      { $set: { employmentDetails: sanitizedEmploymentDetails } },
      { new: true }
    )

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      })
    }

    res.status(200).json({
      success: true,
      data: updatedDocument,
      message: 'Employment Details updated successfully'
    })
  } catch (error) {
    console.error('Error in updating employment details:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update employment details',
      error: error.message
    })
  }
}

const updateDocuments = async (req, res) => {
  const { id } = req.params

  try {
    const documentation = req.files || []

    if (!documentation || documentation.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      })
    }

    const existingDocument = await Administrative.findById(id)

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      })
    }

    const documentationMap = existingDocument.documentation || new Map()

    documentation.forEach(file => {
      documentationMap.set(file.fieldname, file.filename)
    })

    existingDocument.documentation = documentationMap
    await existingDocument.save()

    res.status(200).json({
      success: true,
      message: 'Documents updated successfully',
      data: existingDocument
    })
  } catch (error) {
    console.error('Error in updating documents:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update documents.',
      error: error.message
    })
  }
}

const updateHrFinanceDetails = async (req, res) => {
  const { id } = req.params

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please fill the details'
    })
  }

  try {
    const existingDocument = await Administrative.findById(id)

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      })
    }

    const currentBankDetails = existingDocument.hrFinance || {}

    const hrFinance = {
      ...req.body,
      cancelCheck: req.file
        ? req.file.filename
        : currentBankDetails.cancelCheck || null
    }

    const updatedDocument = await Administrative.findByIdAndUpdate(
      id,
      { $set: { hrFinance: hrFinance } },
      { new: true }
    )

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update Document not found.'
      })
    }

    res.status(200).json({
      success: true,
      data: updatedDocument,
      message: 'Hr finance updated successfully'
    })
  } catch (error) {
    console.error('Error updating Hr Finance:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update hr finance.',
      error: error.message
    })
  }
}


const updateSalaryAndWagesDetails = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  console.log('id is', id);
  console.log('Request body:', JSON.stringify(body, null, 2));

  try {
    const existingDocument = await Administrative.findById(id);

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document not found, please provide a valid id'
      });
    }

    // Directly update the salaryAndWages field with the body data
    const updatedDocument = await Administrative.findByIdAndUpdate(
      id,
      { $set: { salaryAndWages: body } }, // Changed from salaryAndWagesDetails to body directly
      { new: true }
    );

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update, Document not found.'
      });
    }

    console.log('Successfully updated salary and wages');
    
    return res.status(200).json({
      success: true,
      message: 'Salary and wages updated successfully',
      data: updatedDocument.salaryAndWages
    });

  } catch (error) {
    console.error('Error updating Salary and Wages:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update Salary and Wages.',
      error: error.message
    });
  }
};

const updateSystemRights = async (req, res) => {
  const { id } = req.params
  const { authorizedIds, actionPermissions } = req.body

  if (!authorizedIds && !actionPermissions) {
    return res.status(400).json({
      success: false,
      message: 'Please provide module and permissions to update.'
    })
  }

  try {
    const existingDocument = await Administrative.findById(id)

    if (!existingDocument) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      })
    }

    const updatedDocument = await Administrative.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(authorizedIds && { 'systemRights.authorizedIds': authorizedIds }),
          ...(actionPermissions && {
            'systemRights.actionPermissions': actionPermissions
          })
        }
      },
      { new: true }
    )

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update system rights. Document not found.'
      })
    }

    res.status(200).json({
      success: true,
      data: updatedDocument,
      message: 'System rights updated successfully'
    })
  } catch (error) {
    console.error('Error updating system rights:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update system rights',
      error: error.message
    })
  }
}

const getAllAdministrativeData = async (req, res) => {
  try {
    const administrativeData = await Administrative.find({ delete: false })
      .populate({
        path: 'employmentDetails.departmentOrSpeciality',
        select: 'departmentName'
      })
      .populate({
        path: 'employmentDetails.designation',
        select: 'designationName'
      })

    if (administrativeData && administrativeData.length > 0) {
      return res.status(200).json({
        status: 200,
        msg: 'Administrative data found',
        data: administrativeData
      })
    } else {
      return res.status(404).json({
        status: 404,
        msg: 'No administrative data found'
      })
    }
  } catch (error) {
    console.error('Error fetching administrative data:', error)
    return res.status(500).json({
      status: 500,
      msg: 'Server error, please try again later'
    })
  }
}

const getAdministrativeById = async (req, res) => {
  try {
    const { id } = req.params

    // Find the record by ID and ensure `delete` is false
    const administrativeData = await Administrative.findOne({
      _id: id,
      delete: false
    })

    if (administrativeData) {
      return res.status(200).json({
        status: 200,
        success: true,
        msg: 'Administrative data found',
        data: administrativeData
      })
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        msg: 'No administrative data found for the given ID'
      })
    }
  } catch (error) {
    console.error('Error fetching administrative data by ID:', error)
    return res.status(500).json({
      status: 500,
      success: false,
      msg: 'Server error, please try again later'
    })
  }
}

// Get logged-in user's full administrative profile
const getMyAdministrativeProfile = async (req, res) => {
  try {
    // branchId is set in token at login as the refId of the logged-in admin
    const { branchId } = req.user || {};
    if (!branchId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const administrativeData = await Administrative.findOne({ _id: branchId, delete: false })
      .populate({ path: 'employmentDetails.departmentOrSpeciality', select: 'departmentName' })
      .populate({ path: 'employmentDetails.designation', select: 'designationName' })
      .populate({ path: 'employmentDetails.empRole', select: 'roleName name' })
      .populate({ path: 'employmentDetails.reportTo', select: 'basicDetails.firstName basicDetails.lastName' });

    if (!administrativeData) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    return res.status(200).json({ success: true, data: administrativeData });
  } catch (error) {
    console.error('Error fetching my administrative profile:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getAdministrativeForReportTo = async (req, res) => {
  try {
    const administrativeData = await Administrative.find(
      {},
      { _id: 1, 'basicDetails.firstName': 1, 'basicDetails.lastName': 1 }
    )

    if (administrativeData && administrativeData.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Administrative Data found',
        data: administrativeData
      })
    } else {
      return res.status(404).json({
        success: false,
        message: 'No administrative data found',
        data: []
      })
    }
  } catch (error) {
    console.error('Error fetching administrative data:', error)
    res.status(500).json({ message: 'Server error', error })
  }
}

const generateEmpCode = async (req, res) => {
  try {
    const companySetup = await CompanySetupModel.findOne(
      {},
      { hospitalName: 1 }
    )
    if (!companySetup || !companySetup.hospitalName) {
      return res.status(404).json({
        success: false,
        message: 'Hospital name not found in the database'
      })
    }

    const hospitalName = companySetup.hospitalName.trim().split(' ')
    const hospitalPrefix =
      hospitalName.length >= 2
        ? `${hospitalName[0][0].toUpperCase()}${hospitalName[1][0].toUpperCase()}`
        : `${hospitalName[0][0].toUpperCase()}X`

    const prefix = `${hospitalPrefix}AD`

    const lastRecord = await Administrative.findOne()
      .sort({ 'basicDetails.empCode': -1 })
      .select('basicDetails.empCode')

    let nextNumber = 1
    if (lastRecord && lastRecord.basicDetails.empCode) {
      const lastEmpCode = lastRecord.basicDetails.empCode
      const numericPart = parseInt(lastEmpCode.replace(prefix, ''), 10)
      if (!isNaN(numericPart)) {
        nextNumber = numericPart + 1
      }
    }

    const newEmpCode = `${prefix}${nextNumber.toString().padStart(3, '0')}`

    res.status(200).json({
      success: true,
      empCode: newEmpCode,
      message: 'Employee code generated successfully'
    })
  } catch (error) {
    console.error('Error generating empCode:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate empCode',
      error: error.message
    })
  }
}

const deleteAdministrative = async (req, res) => {
  const { id } = req.params

  try {
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID parameter is required'
      })
    }

    const deletedUser = await Administrative.findByIdAndDelete(id)

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'No administrative record found with the given ID'
      })
    }

    const deletedCredentials = await AdminModel.findOneAndDelete({ refId: id })

    if (!deletedCredentials) {
      return res.status(404).json({
        success: false,
        message: 'No crendentials found for the user'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Administrative record deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting administrative record or credentials:', error)
    return res.status(500).json({
      success: false,
      message:
        'An error occurred while deleting the administrative record or credentials',
      error: error.message
    })
  }
}

module.exports = {
  createBasicDetails,
  updateBasicDetails,
  updatePastEmploymentDetails,
  updateEmploymentDetails,
  updateHrFinanceDetails,
  updateSalaryAndWagesDetails,
  updateDocuments,
  updateSystemRights,
  getAllAdministrativeData,
  getAdministrativeById,
  getMyAdministrativeProfile,
  getAdministrativeForReportTo,
  generateEmpCode,
  deleteAdministrative
}
