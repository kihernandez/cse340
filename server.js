/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes
 *************************/
app.use(static)
// Index Route
app.get("/", baseController.buildHome)
// Inventory routes
app.use("/inv", inventoryRoute)


/* ***********************
 * 404 Error Handler
 *************************/
app.use((req, res, next) => {
  next({
    status: 404,
    message: "Sorry, the page you are looking for does not exist."
  })
})


/* ***********************
 * Global Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  console.error("Error:", err)

  // Load utilities so we can build the nav
  const utilities = require("./utilities/")
  const nav = await utilities.getNav()

  const status = err.status || 500
  const message = err.message || "Internal Server Error"

  res.status(status).render("errors/error", {
    title: status === 404 ? "404 Not Found" : "Server Error",
    message,
    status,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
