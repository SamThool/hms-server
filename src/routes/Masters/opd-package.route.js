const express = require("express");
const OPDPackagesRouter = express.Router();
const { OPDPackagesController } = require("../../controllers");
const { handleToken } = require("../../utils/handleToken");

// New route for dropdown (no authentication required for easier testing)
OPDPackagesRouter.get(
  "/dropdown",
  OPDPackagesController.getOPDPackagesForDropdown
);

// Test route (no authentication required)
OPDPackagesRouter.get(
  "/test",
  OPDPackagesController.testOPDPackageEndpoint
);

OPDPackagesRouter.post(
  "/",
  handleToken,
  OPDPackagesController.createOPDPackages
);
OPDPackagesRouter.get(
  "/",
  handleToken,
  OPDPackagesController.getAllOPDPackages
);
OPDPackagesRouter.put(
  "/:id",
  handleToken,
  OPDPackagesController.editOPDPackages
);
OPDPackagesRouter.put(
  "/update-rate/:id",
  handleToken,
  OPDPackagesController.updateOpdPackageRateAndCode
);
OPDPackagesRouter.put(
  "/delete/:id",
  handleToken,
  OPDPackagesController.deleteOPDPackages
);
OPDPackagesRouter.post(
  "/delete/:id",
  handleToken,
  OPDPackagesController.deleteOPDPackages
);
OPDPackagesRouter.post(
  "/import",
  handleToken,
  OPDPackagesController.bulkImport
);

module.exports = OPDPackagesRouter;
