/* ****************************************
 * Account Routes
 **************************************** */
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")



/* ****************************************
 *  Deliver login view
 **************************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))


/* ****************************************
 *  Deliver regitration view
 **************************************** */
router.get("/register", utilities.handleErrors(accountController.buildRegister))



/* ****************************************
 *  Process registration request
 **************************************** */
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* ****************************************
 *  Process Login Request
 **************************************** */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

/* ****************************************
 *  Deliver account management view
 **************************************** */
router.get(
  "/",
  utilities.checkLogin,
  accountController.buildAccountManagement
)


/* ****************************************
 *  Deliver account update view
 **************************************** */
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

/* ****************************************
 *  Process account information update
 **************************************** */
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

/* ****************************************
 *  Process password change
 **************************************** */
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

/* ****************************************
 *  Logout Route
 **************************************** */
router.get("/logout", utilities.handleErrors(accountController.logout))


module.exports = router
