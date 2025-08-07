const express = require("express");
const opdBillingRouter = express.Router();
const {
  createOpdBilling,
  getOpdBillingById,
  updateOpdBilling,
  createOpdCreditBilling,
  getOpdCreditBillingById,
  updateOpdCreditBilling,
  saveCreditPatient,
  updateCreditBilling,
  saveservices,
} = require("../../controllers/OPDBilling/OPDBilling.controller");
const { handleToken } = require("../../utils/handleToken");

// Billing
opdBillingRouter.post("/", handleToken, createOpdBilling);
opdBillingRouter.get("/:id", handleToken, getOpdBillingById);
opdBillingRouter.put("/:id", handleToken, updateOpdBilling);
opdBillingRouter.put("/saveservices/:id", handleToken, saveservices);
// opdBillingRouter.put("/removeservices/:id", handleToken, removeservices);

// Credit Bill
opdBillingRouter.post("/credit", handleToken, createOpdCreditBilling);
opdBillingRouter.post("/credit-patient", handleToken, saveCreditPatient);
opdBillingRouter.get("/credit/:id", handleToken, getOpdCreditBillingById);
opdBillingRouter.put("/credit/:id", handleToken, updateOpdCreditBilling);
opdBillingRouter.put("/credit-patient/:id", handleToken, updateCreditBilling);

module.exports = opdBillingRouter;
