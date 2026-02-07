const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

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
    const vehicle = await invModel.getVehicleById(inv_id)


    if (!vehicle) {
      return next({ status: 404, message: "Vehicle not found" })
    }

    const detailHTML = await utilities.buildVehicleDetailHTML(vehicle)
    let nav = await utilities.getNav()

    const title = `${vehicle.inv_make} ${vehicle.inv_model}`

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

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    message: res.locals.message || []
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    message: res.locals.message || [],
    classification_name: ""
  })
}

/* ***************************
 *  Process add classification form
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result && result.rowCount > 0) {
    const newNav = await utilities.getNav()
    req.flash("notice", "Classification added successfully.")
    return res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav: newNav,
      errors: null,
      message: req.flash("notice")
    })
  } else {
    req.flash("notice", "Failed to add classification.")
    return res.status(500).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      message: req.flash("notice"),
      classification_name
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    errors: null,
    message: res.locals.message || [],
    classificationList,
    classification_id: "",
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_price: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_miles: "",
    inv_color: ""
  })
}

/* ***************************
 *  Process add inventory form
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const nav = await utilities.getNav()
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_miles,
    inv_color
  } = req.body

  const result = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (result && result.rowCount > 0) {
    const newNav = await utilities.getNav()
    req.flash("notice", "Inventory item added successfully.")
    return res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav: newNav,
      errors: null,
      message: req.flash("notice")
    })
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Failed to add inventory item.")
    return res.status(500).render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      errors: null,
      message: req.flash("notice"),
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_miles,
      inv_color
    })
  }
}

module.exports = invCont
