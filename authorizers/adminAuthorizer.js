const fs = require('fs')
const path = require('path')
const jsonwebtoken = require('jsonwebtoken')
const resGen = require('../utils/response-generator')
const models = require('../models')
const config = require('../utils/config-helper')

const publicKey = fs.readFileSync(path.join(__dirname, '..', 'jwt/', `${config.getEnv()}`, 'jwtRS256.key.pub'))

module.exports = (req, res, next) => {
  if (!req.header('authorization')) {
    res.status(403).send(resGen.getObj('Unauthorized'))
    return
  }
  jsonwebtoken.verify(req.headers.authorization, publicKey, {
    algorithms: ['RS256'],
  }, (err, decoded) => {
    if (err) {
      res.status(403).send(resGen.getObj(('Unauthorized')))
    } else {
      return models.User.findOne({
        where: {
          email: decoded.email,
        },
        raw: true,
      }).then((user) => {
        if (!user) {
          throw new Error('No user Found!')
        }
        if (user.role !== 'ADMIN') {
          throw new Error('Unauthorized, not a admin')
        }
        req.user = user
        next()
      }).catch((error) => {
        res.status(403).send(resGen.getObj(error.message))
      })
    }
  })
}
