const express = require("express");
const router = express.Router();
const config = require('../utils/config-helper')
const models = require('../models')

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

router.get("/sync_db", (req, res) => {
  return models.sequelize.authenticate()
      .then(() => models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0'))
      .then(() => models.sequelize.sync({
        force: true,
      }))
      .then(() => models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1'))
      .then(() => models.sequelize.close())
      .catch((err) => {
        console.log(err)
      })
})

module.exports = router;
