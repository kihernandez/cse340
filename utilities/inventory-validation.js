/* ******************************
 * Inventory Validation Middleware
 * ***************************** */


const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name must not contain spaces or special characters.")
  ]
}

// Middleware to check classification data
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      message: null,
      classification_name
    })
  }
  next()
}

// Validation Rules for Adding Inventory Items
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification."),
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Please provide a make."),
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Please provide a model."),
    body("inv_year")
      .isInt({ min: 1900 })
      .withMessage("Please provide a valid year."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Please provide valid miles."),
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Please provide a color."),
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a description."),
  ]
}

/* ******************************
 * Validation rules for updating inventory
 * ***************************** */
validate.newInventoryRules = () => {
  return [
    body("inv_make").trim().isLength({ min: 3 }).withMessage("Make is required."),
    body("inv_model").trim().isLength({ min: 3 }).withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900, max: 9999 }).withMessage("Valid year required."),
    body("inv_price").isFloat().withMessage("Valid price required."),
    body("inv_description").trim().isLength({ min: 10 }).withMessage("Description required."),
    body("inv_image").trim().notEmpty().withMessage("Image path required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path required."),
    body("inv_miles").isInt().withMessage("Miles must be a number."),
    body("inv_color").trim().notEmpty().withMessage("Color required."),
    body("classification_id").isInt().withMessage("Classification required."),
    body("inv_id").isInt().withMessage("Invalid inventory ID.")
  ]
}


// Middleware to check inventory data
validate.checkInventoryData = async (req, res, next) => {
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

  let errors = validationResult(req)
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(classification_id)

  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      errors,
      message: null,
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
  next()
}

/* ******************************
 * Check update data and return errors to edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
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

  let errors = validationResult(req)
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(classification_id)

  if (!errors.isEmpty()) {
    const itemName = `${inv_make} ${inv_model}`

    return res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      errors,
      message: null,
      classificationList,
      inv_id,
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

  next()
}



module.exports = validate
