const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()
const jsonwebtoken = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const models = require('../models')

const config = require('../utils/config-helper')

const privateKey = fs.readFileSync(path.join(__dirname, '..', 'jwt/', `${config.getEnv()}`, '/jwtRS256.key'))
const resGen = require('../utils/response-generator')

/**
 * Login and provide a basic user profile
 * along with a signed JWT token
 */
router.post('/login', (req, res) => {
  if (!req.body.email) {
    res.status(401).send(resGen.getObj('Invalid Email'))
    return
  }

  if (!req.body.password) {
    res.status(401).send(resGen.getObj('Invalid Password'))
    return
  }

  return models.User.unscoped().findOne({
    where: {
      email: req.body.email,
    },
    raw: true,
  }).then((aadharUser) => {
    if (!aadharUser) {
      throw new Error('Please recheck and re-enter the email id and password.')
    }
    if (!bcrypt.compareSync(req.body.password, aadharUser.password)) {
      throw new Error('Please recheck and re-enter password.')
    }

    delete aadharUser.password

    const jwt = {
      email: aadharUser.email,
    }
    const token = jsonwebtoken.sign(jwt, privateKey, {
      expiresIn: '30d',
      algorithm: 'RS256',
    })
    res.cookie('token', token, {
      maxAge: 43200 * 60 * 1000,
      secure: true,
      signed: true,
      httpOnly: true,
    })
    res.status(200).send(aadharUser)
  }).catch((err) => {
    res.status(501).send(resGen.getObj(err.message))
  })
})

/* API to clear out the cookie token */
router.get('/logout', (req, res) => {
  res.cookie('token', null, {
    secure: config.getConfig() === 'production',
    signed: true,
    httpOnly: true,
  })
  res.redirect('/log-in')
})

module.exports = router;
