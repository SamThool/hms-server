const httpStatus = require('http-status')
const { InvestigationRadiologyMasterModel } = require('../../../models')

const getAllInvestigation = async (req, res) => {
    try {
      const investigations = await InvestigationRadiologyMasterModel.find({
        delete: false
      }).populate('subDepartment');
   
      // Using map for a cleaner transformation
      const formattedData = investigations.map(item => {
        const descriptionValue =
          item.description && item.description.length > 0
            ? item.description[0]
            : null;
       
        return {
          ...item._doc,
          description: descriptionValue
        };
      });
  
      return res.status(httpStatus.OK).json({
        msg: 'All investigation found successfully',
        investigation: formattedData
      });
    } catch (error) {
      console.error('Error in getAllInvestigation:', error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ err: 'Server Error', error: error.message });
    }
  }

const addInvestigation = async (req, res) => {
  try {
    const investigation = req.body
    if (!investigation) {
      return res.status(400).json({ msg: 'Please fill all fields' })
    }

    const newInvestigation = new InvestigationRadiologyMasterModel(req.body)
    await newInvestigation.save()
    return res
      .status(httpStatus.CREATED)
      .json({ msg: 'New Inevestigation added successfully', newInvestigation })
  } catch (error) {
    console.log(error)
    res.status(500).json({ err: 'Server Error', error })
  }
}

const editInvestigation = async (req, res) => {
  try {
    const { id } = req.params
    const investigation =
      await InvestigationRadiologyMasterModel.findByIdAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true }
      )

    if (!investigation) {
      return res.status(400).json({ msg: 'Investigation not found' })
    }
    await investigation.save()
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Investigation updated successfully', investigation })
  } catch (error) {
    res.status(500).json({ err: 'Server Error', error })
  }
}

const updateInvestigationRateAndCode = async (req, res) => {
  try {
    const { id } = req.params
    const { rate, newCode } = req.body
    if (rate === undefined && newCode === undefined) {
      return res.status(400).json({
        msg: "Please provide at least one field to update: 'rate' or 'newCode'."
      })
    }

    // Prepare the update object dynamically
    const updateData = {}
    if (rate !== undefined) updateData.rate = rate
    if (newCode !== undefined) updateData.newCode = newCode

    // Update the investigation with the specific fields
    const investigation =
      await InvestigationRadiologyMasterModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true } // Return the updated document
      )

    if (!investigation) {
      return res.status(404).json({
        msg: 'Investigation not found.'
      })
    }

    return res.status(200).json({
      msg: 'Investigation updated successfully.',
      investigation
    })
  } catch (error) {
    console.error('Error updating investigation:', error)
    res.status(500).json({
      err: 'Server Error',
      error: error.message
    })
  }
}

const deleteInvestigation = async (req, res) => {
  try {
    const { id } = req.params
    const investigation =
      await InvestigationRadiologyMasterModel.findByIdAndUpdate(
        { _id: id },
        { delete: true, deletedAt: Date.now() },
        { new: true }
      )
    if (!investigation) {
      return res.status(400).json({ msg: 'Investigation not found' })
    }
    await investigation.save()
    return res
      .status(httpStatus.OK)
      .json({ msg: 'Investigation deleted successfully' })
  } catch (error) {
    res.status(500).json({ err: 'Server Error', error })
  }
}
const bulkImport = async (req, res) => {
  try {
    const investigation = req.body;

    const newInvestigationData = investigation.map(singleInvestigation => {
      // Set testRange to null if missing
      if (!singleInvestigation.testRange) {
        singleInvestigation.testRange = null;
      }

      // Sanitize subDepartment
      if (
        !singleInvestigation.subDepartment ||
        typeof singleInvestigation.subDepartment !== 'string' ||
        singleInvestigation.subDepartment.trim() === ''
      ) {
        // Option 1: Remove the field completely (if optional)
        delete singleInvestigation.subDepartment;

        // Option 2 (alternative): Set to null (only if schema allows)
        // singleInvestigation.subDepartment = null;
      }

      return singleInvestigation;
    });

    const result = await InvestigationRadiologyMasterModel.insertMany(
      newInvestigationData
    );

    res
      .status(httpStatus.CREATED)
      .json({ msg: 'Investigation Created', data: result });

  } catch (error) {
    console.error('Bulk import error:', error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 'Internal server error', details: error.message });
  }
};


module.exports = {
  addInvestigation,
  getAllInvestigation,
  editInvestigation,
  deleteInvestigation,
  bulkImport,
  updateInvestigationRateAndCode
}
