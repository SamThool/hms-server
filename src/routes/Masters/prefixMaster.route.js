const express = require("express");
const prefixMasterRouter = express.Router();
const { prefixController } = require("../../controllers");
const { validatePrefixMaster } = require("../../validations/Masters/prefixMaster.validation");
const {handleToken} = require('../../utils/handleToken'); 

prefixMasterRouter.get("/", handleToken, prefixController.getPrefix);
prefixMasterRouter.post("/", handleToken, validatePrefixMaster, prefixController.addPrefix);
prefixMasterRouter.put("/:id", handleToken, prefixController.updatePrefix);
prefixMasterRouter.put("/delete/:id", handleToken, prefixController.deletePrefix);

module.exports = prefixMasterRouter;
