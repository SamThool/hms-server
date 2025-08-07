const express = require("express");

const OPDReceiptRouter = express.Router();
const { handleToken } = require("../../utils/handleToken");

const { OPDReciptController } = require("../../controllers");

OPDReceiptRouter.post(
  "/add",
  handleToken,
  OPDReciptController.createOPDReceipt
);
OPDReceiptRouter.get(
  "/latestOPDReceiptNo",
  OPDReciptController.getLatestOPDReceiptNo
);
OPDReceiptRouter.get(
  "/getOpdReceipts/:id",
  OPDReciptController.getAllGeneratedReceiptsAgainstOPDPatient
);
OPDReceiptRouter.get("/getAllReceipts", OPDReciptController.getAllReceipts);

OPDReceiptRouter.get(
  "/daily",
  OPDReciptController.getAllOpdReceiptsCurrentDate
);

// ➕ Add or update discount on a receipt
OPDReceiptRouter.patch(
  "/:receiptId/add-discount",
  handleToken,
  OPDReciptController.addDiscountToReceipt
);

// ✅ Update only the discount status (pending/approved)
OPDReceiptRouter.patch(
  "/:receiptId/update-discount-status",
  handleToken,
  OPDReciptController.updateDiscountStatus
);

module.exports = OPDReceiptRouter;
