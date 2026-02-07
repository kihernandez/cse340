// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view
router.get("/detail/:inv_id", invController.buildByInvId);

// Route to build inventory management view
router.get( "/", utilities.handleErrors(invController.buildManagement) )

// Routes for adding classifications
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Process the add classfication 
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Routes for adding inventory items
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Process the add inventory item form
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)


// Intentional 500 error route
router.get("/cause-error", invController.triggerError)

module.exports = router;