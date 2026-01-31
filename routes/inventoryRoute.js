// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory detail view
router.get("/detail/:inv_id", invController.buildByInvId);

// Intentional 500 error route
router.get("/cause-error", invController.triggerError)

module.exports = router;