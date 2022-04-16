const express = require("express");
const router = express.Router();
const config = require('../utils/config-helper')
const resGen = require('../utils/response-generator')

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("log-in");
});

// get login page of
router.get("/log-in", (req, res) => {
  res.render("authentication/login", {
    config: config.getConfig(),
    title: "Aadhar - Login",
    active: {
      login: true,
    },
  });
});

module.exports = router;
