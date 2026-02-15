/* ****************************************
 *  Inventory Routes
 **************************************** */
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")


// Public Inventory Views
router.get("/type/:classificationId", invController.buildByClassificationId)
router.get("/detail/:inv_id", invController.buildByInvId)


// Inventory Management View
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkEmployee,
  utilities.handleErrors(invController.buildManagement)
)

// Add Classification View
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkEmployee,
  utilities.handleErrors(invController.buildAddClassification)
)


// Add Classification
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkEmployee,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Add Inventory View
router.get(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkEmployee,
  utilities.handleErrors(invController.buildAddInventory)
)

// Add Inventory
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkEmployee,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

// Intentional 500 error route
router.get("/cause-error", invController.triggerError)

// JSON Inventory 
router.get(
  "/getInventory/:classification_id",
  utilities.checkLogin,
  utilities.checkEmployee,
  utilities.handleErrors(invController.getInventoryJSON)
)

// Edit Inventory 
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkEmployee,
  utilities.handleErrors(invController.editInventoryView)
)

// Update Inventory 
router.post(
  "/update",
  utilities.checkLogin,
  utilities.checkEmployee,
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Delete Confirmation 
router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkEmployee,
  utilities.handleErrors(invController.buildDeleteView)
)

// Delete Inventory 
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.checkEmployee,
  utilities.handleErrors(invController.deleteInventory)
)

// Vehicle detail
router.get("/detail/:inv_id", invController.buildByInvId)

// Add review 
router.post(
  "/review",
  utilities.checkLogin,
  invController.addReview
)

// Edit Review View
router.get(
  "/review/edit/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildEditReview)
)

// Update Review
router.post(
  "/review/update",
  utilities.checkLogin,
  utilities.handleErrors(invController.updateReview)
)

// Delete Review
router.post(
  "/review/delete",
  utilities.checkLogin,
  utilities.handleErrors(invController.deleteReview)
)


module.exports = router
