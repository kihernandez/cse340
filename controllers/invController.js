const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    // If no vehicles found, trigger 404
    if (!data || data.length === 0) {
      return next({
        status: 404,
        message: "No vehicles found for this classification."
      })
    }

    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}


/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try { 
    const inv_id = req.params.inv_id 
    const data = await invModel.getVehicleById(inv_id)

    if (!data) {
      return next({status: 404, message: "Vehicle not found"})
    }

    const detailHTML = await utilities.buildVehicleDetailHTML(data)
    let nav = await utilities.getNav()

    const title = `${data.inv_make} ${data.inv_model}`

    res.render("./inventory/detail", {
      title,
      nav,
      detailHTML,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Trigger intentional 500 error
 * ************************** */
invCont.triggerError = (req, res, next) => {
  next(new Error("Intentional 500 error triggered"))
}

module.exports = invCont