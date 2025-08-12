const {
  ServiceRateList,
  ServiceModal,
} = require("../../models/Masters/serviceRateNew.model");

const mongoose = require("mongoose");
const { generateUniqueId, getNextSequenceNumber } = require("../../utils/generateUniqueId");

// Utility function for validating required fields
const validateFields = (fields) => {
  return fields.some(
    (field) => !field || (typeof field === "string" && field.trim() === "")
  );
};

// Create a new service rate
const createNewService = async (req, res) => {
  try {
    const { name, category, parentPayee, payee } = req.body;
    console.log(req.body);
    // Validate required fields
    if (validateFields([name, category])) {
      return res.status(400).json({
        message: "All required fields (name, category) must be provided.",
      });
    }

    // Check if the service rate already exists
    const existingServiceRate = await ServiceRateList.findOne({ name });
    if (existingServiceRate) {
      return res.status(400).json({
        message: `Service rate with the name "${name}" already exists.`,
      });
    }

    // Create a new service rate
    const newServiceRate = new ServiceRateList({
      name,
      category,
      parentPayee,
      payee,
    });

    await newServiceRate.save();
    return res.status(201).json({
      success: true,
      message: "Service rate created successfully.",
      data: newServiceRate,
    });
  } catch (error) {
    console.error("Error creating service rate:", error); // Log error for debugging
    return res.status(500).json({
      message: "Failed to create service rate.",
      error: error.message,
    });
  }
};

const editService = async (req, res) => {
  const { id } = req.params;
  console.log("ed", req.body);

  try {
    const updateService = await ServiceRateList.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updateService) {
      return res
        .status(404)
        .json({ success: false, message: "Service rate list not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Service rate list updated successfully",
      data: updateService,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all service rates
const getAllServiceRates = async (req, res) => {
  try {
    const serviceRates = await ServiceRateList.find({ delete: false });
    return res.status(200).json({
      message: "Service rates fetched successfully.",
      data: serviceRates,
    });
  } catch (error) {
    console.error("Error fetching service rates:", error); // Log error for debugging
    return res.status(500).json({
      message: "Failed to fetch service rates.",
      error: error.message,
    });
  }
};

//update service rate

const updateServiceRates = async (req, res) => {
  console.log("updateddddddddddddddddd??????????????????>>>>>>>>>", req.body);

  const { id } = req.params;
  const {
    serviceRateListItemId,
    filter,
    serviceIdOfRelatedMaster,
    rate,
    code,
  } = req.body;

  try {
    const serviceRateListItem = await ServiceRateList.findById(
      serviceRateListItemId
    );
    const charityList = await ServiceRateList.find({ category: "Charity" });

    if (!serviceRateListItem) {
      return res
        .status(404)
        .json({ success: false, message: "Service rate list item not found" });
    }

    let targetArray;
    switch (filter) {
      case "pathology":
        targetArray = serviceRateListItem.pathology;
        break;
      case "radiology":
        targetArray = serviceRateListItem.radiology;
        break;
      case "opdPackage":
        targetArray = serviceRateListItem.opdPackage;
        break;
      case "otherServices":
        targetArray = serviceRateListItem.otherServices;
        break;
      case "opdConsultant":
        targetArray = serviceRateListItem.opdConsultant;
        break;
      case "otherDiagnostics":
        targetArray = serviceRateListItem.otherDiagnostics;
        break;
      case "pathologyProfiles":
        targetArray = serviceRateListItem.pathologyProfiles;
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid filter" });
    }

    const existingServiceIndex = targetArray.findIndex(
      (service) =>
        service.serviceIdOfRelatedMaster.toString() === serviceIdOfRelatedMaster
    );

    if (existingServiceIndex !== -1) {
      const existingService = targetArray[existingServiceIndex];

      if (rate !== undefined && existingService.rate !== rate) {
        existingService.rate = rate;
        existingService.rateUpdatedAt = Date.now();
      }

      if (code !== undefined && existingService.code !== code) {
        existingService.code = code;
        existingService.codeUpdatedAt = Date.now();
      }

      // ✅ Save the filter
      existingService.filter = filter;
    } else {
      // Generate unique ID for new service
      const existingCodes = targetArray.map(service => service.code).filter(code => code);
      const nextSequenceNumber = getNextSequenceNumber(existingCodes, serviceRateListItem.name);
      const uniqueId = generateUniqueId(serviceRateListItem.name, nextSequenceNumber);
      
      const newService = {
        serviceIdOfRelatedMaster,
        rate: rate || 0,
        code: uniqueId, // Use generated unique ID instead of empty string
        isValid: true,
        filter, // ✅ Save the filter here
        rateCreatedAt: Date.now(),
        rateUpdatedAt: Date.now(),
        codeCreatedAt: Date.now(),
        codeUpdatedAt: Date.now(),
      };
      targetArray.push(newService); // Un-commented to push new service
    }

    await serviceRateListItem.save();

    if (serviceRateListItem.category === "Cash") {
      for (const charityItem of charityList) {
        let payeeType = charityItem.parentPayee[0]?.toLowerCase();
        let charityRate = 0;
        if (payeeType === "weaker") charityRate = rate * 0.5;
        else if (payeeType === "indigenous") charityRate = 0;
        else continue;

        let targetArrayForCharity;
        switch (filter) {
          case "pathology":
            targetArrayForCharity = charityItem.pathology;
            break;
          case "radiology":
            targetArrayForCharity = charityItem.radiology;
            break;
          case "opdPackage":
            targetArrayForCharity = charityItem.opdPackage;
            break;
          case "otherServices":
            targetArrayForCharity = charityItem.otherServices;
            break;
          case "opdConsultant":
            targetArrayForCharity = charityItem.opdConsultant;
            break;
          case "otherDiagnostics":
            targetArrayForCharity = charityItem.otherDiagnostics;
            break;
          case "pathologyProfiles":
            targetArrayForCharity = charityItem.pathologyProfiles;
            break;
          default:
            continue;
        }

        const existingCharityServiceIndex = targetArrayForCharity.findIndex(
          (service) =>
            service.serviceIdOfRelatedMaster.toString() ===
            serviceIdOfRelatedMaster
        );

        if (existingCharityServiceIndex !== -1) {
          const existingService =
            targetArrayForCharity[existingCharityServiceIndex];
          if (existingService.rate !== charityRate) {
            existingService.rate = charityRate;
            existingService.rateUpdatedAt = Date.now();
          }
          if (code !== undefined && existingService.code !== code) {
            existingService.code = code;
            existingService.codeUpdatedAt = Date.now();
          }

          // ✅ Save the filter
          existingService.filter = filter;
        } else {
          const newCharityService = {
            serviceIdOfRelatedMaster,
            rate: charityRate,
            code: code || "",
            isValid: true,
            filter, // ✅ Save the filter here
            rateCreatedAt: Date.now(),
            rateUpdatedAt: Date.now(),
            codeCreatedAt: Date.now(),
            codeUpdatedAt: Date.now(),
          };
          targetArrayForCharity.push(newCharityService);
        }

        await charityItem.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "Rate and Code Updated Successfully",
      data: serviceRateListItem,
    });
  } catch (error) {
    console.error("Error updating service rates:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

//update service rate through the patholody profiles service rate table from master
const updateMassServiceRateThroughPathology = async (req, res) => {
  try {
    console.log("the request is receiving on the mass update service rate api");

    const dataArray = req.body;
    console.log("API req.body: ", dataArray);

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array",
      });
    }

    // Extract serviceRateListItemId and filter from first element
    const { serviceRateListItemId, filter } = dataArray[0];

    if (!serviceRateListItemId || !filter) {
      return res.status(400).json({
        success: false,
        message: "Missing serviceRateListItemId or filter",
      });
    }

    const serviceRateListItem = await ServiceRateList.findById(
      serviceRateListItemId
    );

    if (!serviceRateListItem) {
      return res.status(404).json({
        success: false,
        message: "ServiceRateListItem not found",
      });
    }

    // Select target array based on filter
    let targetArray;
    switch (filter) {
      case "pathologyProfiles":
        targetArray = serviceRateListItem.pathologyProfiles;
        break;
      case "pathology":
        targetArray = serviceRateListItem.pathology;
        break;
      case "radiology":
        targetArray = serviceRateListItem.radiology;
        break;
      case "opdPackage":
        targetArray = serviceRateListItem.opdPackage;
        break;
      case "otherServices":
        targetArray = serviceRateListItem.otherServices;
        break;
      case "opdConsultant":
        targetArray = serviceRateListItem.opdConsultant;
        break;
      case "otherDiagnostics":
        targetArray = serviceRateListItem.otherDiagnostics;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid filter",
        });
    }

    const createdIds = [];
    const updatedIds = [];

    // Loop through each incoming item and update or create records
    dataArray.forEach((item) => {
      const { serviceIdOfRelatedMaster, rate, code } = item;

      const existingIndex = targetArray.findIndex(
        (service) =>
          service.serviceIdOfRelatedMaster.toString() ===
          serviceIdOfRelatedMaster
      );

      if (existingIndex !== -1) {
        // ✅ Existing → update
        const existingService = targetArray[existingIndex];

        if (rate !== undefined) {
          existingService.rate = rate;
          existingService.rateUpdatedAt = Date.now();
        }

        if (code !== undefined) {
          existingService.code = code;
          existingService.codeUpdatedAt = Date.now();
        }

        existingService.filter = filter; // Optional if needed

        updatedIds.push(serviceIdOfRelatedMaster);
      } else {
        // ✅ Not existing → create new
        // Generate unique ID for new service
        const existingCodes = targetArray.map(service => service.code).filter(code => code);
        const nextSequenceNumber = getNextSequenceNumber(existingCodes, serviceRateListItem.name);
        const uniqueId = generateUniqueId(serviceRateListItem.name, nextSequenceNumber);
        
        const newService = {
          serviceIdOfRelatedMaster,
          rate: rate || 0,
          code: uniqueId, // Use generated unique ID instead of empty string
          isValid: true,
          filter,
          rateCreatedAt: Date.now(),
          rateUpdatedAt: Date.now(),
          codeCreatedAt: Date.now(),
          codeUpdatedAt: Date.now(),
        };

        targetArray.push(newService);
        console.log(`Created new entry for id ${serviceIdOfRelatedMaster} with unique code ${uniqueId}`);
        createdIds.push(serviceIdOfRelatedMaster);
      }
    });

    // Mark array as modified so Mongoose knows to save full array
    switch (filter) {
      case "pathologyProfiles":
        serviceRateListItem.markModified("pathologyProfiles");
        break;
      case "pathology":
        serviceRateListItem.markModified("pathology");
        break;
      case "radiology":
        serviceRateListItem.markModified("radiology");
        break;
      case "opdPackage":
        serviceRateListItem.markModified("opdPackage");
        break;
      case "otherServices":
        serviceRateListItem.markModified("otherServices");
        break;
      case "opdConsultant":
        serviceRateListItem.markModified("opdConsultant");
        break;
      case "otherDiagnostics":
        serviceRateListItem.markModified("otherDiagnostics");
        break;
    }

    await serviceRateListItem.save();

    return res.status(200).json({
      success: true,
      message: "Mass update completed (existing and new records created)",
      updatedCount: updatedIds.length,
      createdCount: createdIds.length,
      updatedIds,
      createdIds,
    });
  } catch (error) {
    console.error("Error updating service code and rates:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const fetchServiceCodeAndRatesAccordingToServiceListItemAndFilter = async (
  req,
  res
) => {
  const { selectedRateListItemId, selectedFilter } = req.params;

  try {
    // Fetch the service rate list item by ID
    const serviceRateListItem = await ServiceRateList.findById(
      selectedRateListItemId
    );

    if (!serviceRateListItem) {
      return res
        .status(404)
        .json({ success: false, message: "Service rate list item not found" });
    }

    // Extract the relevant array based on the selected filter
    const selectedServiceArray = serviceRateListItem[selectedFilter];

    if (!selectedServiceArray || !Array.isArray(selectedServiceArray)) {
      return res.status(400).json({
        success: false,
        message: "Invalid filter or no data found for the selected filter",
      });
    }

    // Initialize empty objects for rateList, codeList, and idList
    const rateList = {};
    const codeList = {};
    const idList = {};

    // Populate rateList, codeList, and idList
    selectedServiceArray.forEach((service, index) => {
      const serviceId = service.serviceIdOfRelatedMaster;
      rateList[serviceId] = service.rate;
      codeList[serviceId] = service.code;
      
      // Generate service ID for display (auto-generated unique ID)
      // Always generate a sequential ID based on the index, regardless of whether service.code exists
      const serviceDisplayId = generateUniqueId(serviceRateListItem.name, index + 1);
      idList[serviceId] = serviceDisplayId;
    });

    // Return the response with rateList, codeList, and idList
    return res.status(200).json({ success: true, rateList, codeList, idList });
  } catch (error) {
    console.error("Error fetching service code and rates:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const updateRecordIsValid = async (req, res) => {
  const {
    serviceRateListItemId,
    filter,
    serviceIdOfRelatedMaster,
    isValid,
    savedFor,
  } = req.body;

  // Validate incoming data
  if (
    !serviceRateListItemId ||
    !filter ||
    !serviceIdOfRelatedMaster ||
    typeof isValid !== "boolean"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid input data. Please provide all required fields.",
    });
  }

  try {
    // Convert IDs to MongoDB ObjectId
    const serviceRateListItemObjectId = new mongoose.Types.ObjectId(
      serviceRateListItemId
    );
    const serviceIdOfRelatedMasterObjectId = new mongoose.Types.ObjectId(
      serviceIdOfRelatedMaster
    );

    // Find the service rate list item by ID
    const serviceRateListItem = await ServiceRateList.findById(
      serviceRateListItemObjectId
    );

    if (!serviceRateListItem) {
      return res.status(404).json({
        success: false,
        message: "Service rate list item not found.",
      });
    }

    // Determine which array to update based on the filter (e.g., pathology, radiology, etc.)
    let targetArray;
    switch (filter) {
      case "pathology":
        targetArray = serviceRateListItem.pathology;
        break;
      case "radiology":
        targetArray = serviceRateListItem.radiology;
        break;
      case "opdPackage":
        targetArray = serviceRateListItem.opdPackage;
        break;
      case "otherServices":
        targetArray = serviceRateListItem.otherServices;
        break;
      case "opdConsultant":
        targetArray = serviceRateListItem.opdConsultant;
        break;
      case "otherDiagnostics":
        targetArray = serviceRateListItem.otherDiagnostics;
        break;
      case "pathologyProfiles":
        targetArray = serviceRateListItem.pathologyProfiles;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid filter provided.",
        });
    }

    // Find the specific record in the target array
    let recordToUpdate = targetArray.find((record) =>
      record.serviceIdOfRelatedMaster.equals(serviceIdOfRelatedMasterObjectId)
    );

    if (!recordToUpdate) {
      // If no record is found, create a new record
      const newRecord = {
        serviceIdOfRelatedMaster: serviceIdOfRelatedMasterObjectId,
        rate: 0, // Default rate (you can set this to a meaningful default value)
        code: "", // Default code (you can set this to a meaningful default value)
        isValid: isValid,
      };

      // Add the new record to the target array
      targetArray.push(newRecord);
      recordToUpdate = newRecord; // Set recordToUpdate to the newly created record
    } else {
      // If the record is found, update its isValid status
      recordToUpdate.isValid = isValid;
    }

    // Save the updated document
    await serviceRateListItem.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Record updated successfully.",
      data: recordToUpdate,
    });
  } catch (error) {
    console.error("Error updating record isValid status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const fetchIsValidStatusOfRecords = async (req, res) => {
  const { selectedRateListItemId, selectedFilter } = req.params;

  try {
    // Fetch the service rate list item by ID
    const serviceRateListItem = await ServiceRateList.findById(
      selectedRateListItemId
    );

    if (!serviceRateListItem) {
      return res.status(404).json({
        success: false,
        message: "Service rate list item not found",
      });
    }

    // Extract the relevant array based on the selected filter
    const selectedServiceArray = serviceRateListItem[selectedFilter];

    if (!selectedServiceArray || !Array.isArray(selectedServiceArray)) {
      return res.status(400).json({
        success: false,
        message: "Invalid filter or no data found for the selected filter",
      });
    }

    // Initialize an empty object for isValidList
    const isValidList = {};

    // Populate isValidList with the isValid status of each record
    selectedServiceArray.forEach((service) => {
      const serviceId = service.serviceIdOfRelatedMaster;
      isValidList[serviceId] = service.isValid;
    });

    // Return the response with isValidList
    return res.status(200).json({ success: true, isValidList });
  } catch (error) {
    console.error("Error fetching isValid status of records:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const fetchValidServicesOfRatelist = async (req, res) => {
  const { selectedRateListItemId, selectedFilter } = req.params;

  try {
    // Validate input
    if (!selectedRateListItemId || !selectedFilter) {
      return res
        .status(400)
        .json({ message: "Rate list ID and filter are required." });
    }

    // Fetch the rate list item
    const rateListItem = await ServiceRateList.findById(selectedRateListItemId)
      .populate({
        path: `${selectedFilter}.serviceIdOfRelatedMaster`, // Populate the referenced document
      })
      .exec();

    // Check if the rate list item exists
    if (!rateListItem) {
      return res.status(404).json({ message: "Rate list item not found." });
    }

    // Filter valid services based on the selected filter
    const validServices = rateListItem[selectedFilter].filter(
      (service) =>
        service.isValid === true &&
        service.code && // Check if code is not empty
        service.rate && // Check if rate is not empty
        service.serviceIdOfRelatedMaster // Ensure the referenced document exists
    );

    // Map the filtered data to include only the required fields
    const result = validServices.map((service) => ({
      serviceIdOfRelatedMaster: service.serviceIdOfRelatedMaster,
      code: service.code,
      rate: service.rate,
      isValid: service.isValid,
    }));

    // Return the filtered data
    return res.status(200).json({
      success: true,

      data: result,
    });
  } catch (error) {
    console.error("Error fetching valid services:", error);

    // Generic server error response
    return res
      .status(500)
      .json({ message: "An error occurred while fetching valid services." });
  }
};

const deleteServiceRateListItem = async (req, res) => {
  const { selectedRateListItemId } = req.params;

  try {
    // Check if the ID is provided
    if (!selectedRateListItemId) {
      return res
        .status(400)
        .json({ message: "Rate list item ID is required." });
    }

    // Soft delete the record by setting `delete` to true
    const deletedRecord = await ServiceRateList.findByIdAndUpdate(
      selectedRateListItemId,
      { delete: true },
      { new: true } // Return the updated document
    );

    // Check if the record was found and updated
    if (!deletedRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Rate list item not found." });
    }

    return res.status(200).json({
      success: true,
      message: `${deletedRecord.name} deleted successfully`,
      data: deletedRecord,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while deleting the rate list item.",
    });
  }
};

const getCreatedAndUpdatedHistoryOfServiceRate = async (req, res) => {
  const { selectedRateListItemId, selectedFilter, serviceIdOfRelatedMaster } =
    req.params;

  try {
    // Find the ServiceRateList document by ID
    const serviceRateListItem = await ServiceRateList.findById(
      selectedRateListItemId
    );

    if (!serviceRateListItem) {
      return res
        .status(404)
        .json({ success: false, message: "Service rate list item not found" });
    }

    // Determine which array to search based on the selectedFilter
    let targetArray;
    switch (selectedFilter) {
      case "pathology":
        targetArray = serviceRateListItem.pathology;
        break;
      case "radiology":
        targetArray = serviceRateListItem.radiology;
        break;
      case "opdPackage":
        targetArray = serviceRateListItem.opdPackage;
        break;
      case "otherServices":
        targetArray = serviceRateListItem.otherServices;
        break;
      case "opdConsultant":
        targetArray = serviceRateListItem.opdConsultant;
        break;
      case "otherDiagnostics":
        targetArray = serviceRateListItem.otherDiagnostics;
        break;
      case "pathologyProfiles":
        targetArray = serviceRateListItem.pathologyProfiles;
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid filter" });
    }

    // Find the service in the respective array
    const service = targetArray.find(
      (item) =>
        item.serviceIdOfRelatedMaster.toString() === serviceIdOfRelatedMaster
    );

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Details not found" });
    }

    // Return the createdAt and updatedAt history for the found service
    return res.status(200).json({
      success: true,
      message: "Service rate history fetched successfully",
      data: service,
    });
  } catch (error) {
    console.error("Error fetching service rate history:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const populateFields = [
  "pathology.serviceIdOfRelatedMaster",
  "radiology.serviceIdOfRelatedMaster",
  "opdPackage.serviceIdOfRelatedMaster",
  "otherServices.serviceIdOfRelatedMaster",
  "opdConsultant.serviceIdOfRelatedMaster",
  "otherDiagnostics.serviceIdOfRelatedMaster",
  "pathologyProfiles.serviceIdOfRelatedMaster",
];
const getApplicableServiceRateListForPatient = async (req, res) => {
  console.log("object");
  const { payeeCategory, patientPayee, tpa } = req.params;
  console.table([payeeCategory, patientPayee, tpa]);
  const cleanedPayeeCategory = payeeCategory.trim();
  const cleanedPatientPayee = patientPayee;
  const cleanedTpa = tpa;

  // Base query for category and delete: false
  const baseQuery = {
    category: cleanedPayeeCategory,
    delete: false,
  };

  let data;

  if (
    cleanedPayeeCategory.toLowerCase() === "cash" ||
    cleanedPayeeCategory.toLowerCase() === "gipsaa"
  ) {
    // If category is "Cash", not parent payee and tpa so object will be returned directly
    data = await ServiceRateList.findOne(baseQuery).populate(populateFields);
  } else if (cleanedPayeeCategory.toLowerCase() === "insurance") {
    // If category is "Insurance", check for parentPayee and payee
    if (cleanedPatientPayee && cleanedTpa) {
      // First, check for records where both parentPayee and payee match
      data = await ServiceRateList.findOne({
        ...baseQuery,
        parentPayee: { $in: [cleanedPatientPayee] },
        payee: { $in: [cleanedTpa] },
      }).populate(populateFields);
    }

    // If no record is found, fall back to records where only parentPayee matches and payee is empty
    if (!data && cleanedPatientPayee) {
      data = await ServiceRateList.findOne({
        ...baseQuery,
        parentPayee: { $in: [cleanedPatientPayee] },
        payee: { $size: 0 },
      }).populate(populateFields);
    }
  } else if (cleanedPayeeCategory.toLowerCase() === "corporate public") {
    // If category is "Corporate Public", only check for parentPayee
    if (cleanedPatientPayee) {
      data = await ServiceRateList.findOne({
        ...baseQuery,
        parentPayee: { $in: [cleanedPatientPayee] },
      }).populate(populateFields);
    }
  } else if (cleanedPayeeCategory.toLowerCase() === "government scheme") {
    //if payee category is 'government scheme', only check for parentPayee
    if (cleanedPatientPayee) {
      data = await ServiceRateList.findOne({
        ...baseQuery,
        parentPayee: { $in: [cleanedPatientPayee] },
      }).populate(populateFields);
    }
  } else if (cleanedPayeeCategory.toLowerCase() === "corporate private") {
    //if payee category is 'corporate private'
    if (cleanedPatientPayee) {
      data = await ServiceRateList.findOne({
        ...baseQuery,
        parentPayee: { $in: [cleanedPatientPayee] },
      }).populate(populateFields);
    }
  } else if (cleanedPayeeCategory.toLowerCase() === "charity") {
    //if payee category is charity -> rate will be either weaker or indigenous

    // if (cleanedPatientPayee) {
    //   data = await ServiceRateList.findOne({
    //     ...baseQuery,
    //     parentPayee: { $in: [cleanedPatientPayee] },
    //   }).populate(populateFields);
    // }
    data = await ServiceRateList.findOne({
      category: "Cash",
      delete: false,
    }).populate(populateFields);
  }

  // If no data is found, return a 404 error
  if (!data) {
    return res.status(404).json({ message: "No matching rate list found" });
  }
  // Return the found data
  return res.status(200).json({ data });
};

// Generate unique IDs for existing services that don't have codes
const generateUniqueIdsForExistingServices = async (req, res) => {
  const { serviceRateListItemId } = req.params;

  try {
    const serviceRateListItem = await ServiceRateList.findById(serviceRateListItemId);
    
    if (!serviceRateListItem) {
      return res.status(404).json({ 
        success: false, 
        message: "Service rate list item not found" 
      });
    }

    const filters = ['pathology', 'radiology', 'opdPackage', 'otherServices', 'opdConsultant', 'otherDiagnostics', 'pathologyProfiles'];
    let updatedCount = 0;

    for (const filter of filters) {
      const targetArray = serviceRateListItem[filter];
      if (!targetArray || !Array.isArray(targetArray)) continue;

      // Get existing codes for this filter
      const existingCodes = targetArray.map(service => service.code).filter(code => code);
      
      for (let i = 0; i < targetArray.length; i++) {
        const service = targetArray[i];
        
        // Only generate unique ID if service doesn't have a code or has empty code
        if (!service.code || service.code.trim() === '') {
          const nextSequenceNumber = getNextSequenceNumber(existingCodes, serviceRateListItem.name);
          const uniqueId = generateUniqueId(serviceRateListItem.name, nextSequenceNumber);
          
          service.code = uniqueId;
          service.codeCreatedAt = Date.now();
          service.codeUpdatedAt = Date.now();
          service.filter = filter;
          
          existingCodes.push(uniqueId);
          updatedCount++;
        }
      }
    }

    await serviceRateListItem.save();

    return res.status(200).json({
      success: true,
      message: `Generated unique IDs for ${updatedCount} services`,
      updatedCount
    });

  } catch (error) {
    console.error("Error generating unique IDs for existing services:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = {
  createNewService,
  editService,
  getAllServiceRates,
  updateServiceRates,
  updateMassServiceRateThroughPathology,
  fetchServiceCodeAndRatesAccordingToServiceListItemAndFilter,
  updateRecordIsValid,
  fetchIsValidStatusOfRecords,
  deleteServiceRateListItem,
  fetchValidServicesOfRatelist,
  getCreatedAndUpdatedHistoryOfServiceRate,
  getApplicableServiceRateListForPatient,
  generateUniqueIdsForExistingServices,
};
