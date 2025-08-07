const express = require('express');
const ParameterMasterRouter = express.Router();
const parameterController = require('../../../controllers/Masters/clinical-setup/parameter-master/parameterMaster.controller')
const {handleToken} = require('../../../utils/handleToken'); 

ParameterMasterRouter.post('/', handleToken,parameterController.createParameter);

ParameterMasterRouter.post('/import', handleToken,parameterController.bulkImport);

ParameterMasterRouter.get('/', handleToken,parameterController.getAllParameters);

ParameterMasterRouter.get('/:id', handleToken,parameterController.getParametersById);

ParameterMasterRouter.put('/:id', handleToken,parameterController.updateParametersById);

ParameterMasterRouter.put('/delete/:id', handleToken,parameterController.deleteParametersById);

module.exports = ParameterMasterRouter;
