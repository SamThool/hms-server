const Joi = require("joi");
const httpStatus = require("http-status");
const VitalParameterModel = require("../../../../models/Masters/clinical-setup/parameter-master/parameterMaster.model");
const mongoose = require('mongoose');
const parameterSchema = Joi.object({
  vital: Joi.string().required(),
  parameters: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      subParameters: Joi.array().items(Joi.string().optional()).optional(),
    })
  ).required()
});

const createParameter = async (req, res) => {
  try {
    const { error } = parameterSchema.validate(req.body);
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({ error: error.details[0].message });
    }

    const { vital, parameters } = req.body;
    const newVital = new VitalParameterModel({ vital, parameters });
    await newVital.save();
    res.status(httpStatus.CREATED).json({ msg: "Vital with parameters created!!", data: newVital });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getAllParameters = async (req, res) => {
  try {
    const data = await VitalParameterModel.find({ delete: false }).populate('vital')
    res.status(httpStatus.OK).json({ data });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const getParametersById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await VitalParameterModel.findById(id).populate('vital')
    if (!data || data.delete === true) {
      return res.status(httpStatus.NOT_FOUND).json({ error: "Data not found" });
    }
    res.status(httpStatus.OK).json({ data });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
const updateParametersById = async (req, res) => {
  try {
    const { id } = req.params;

  

    // Attempt to update the document
    const updated = await VitalParameterModel.findByIdAndUpdate(
      id,
      {
        ...req.body,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Data not found' });
    }

    res.status(httpStatus.OK).json({ msg: 'Data updated successfully!', data: updated });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message || 'Internal Server Error' });
  }
};
const deleteParametersById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await VitalParameterModel.findByIdAndUpdate(
      id,
      { delete: true, deletedAt: Date.now() },
      { new: true }
    );
    if (!deleted) {
      return res.status(httpStatus.NOT_FOUND).json({ error: "Data not found" });
    }
    res.status(httpStatus.OK).json({ msg: "Data deleted successfully" });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const bulkImport = async (req, res) => {
  try {
    const data = req.body;
    const result = await VitalParameterModel.insertMany(data);
    res.status(httpStatus.CREATED).json({ msg: "Data created in bulk", data: result });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
  }
};

module.exports = {
  createParameter,
  getAllParameters,
  getParametersById,
  updateParametersById,
  deleteParametersById,
  bulkImport,
};
