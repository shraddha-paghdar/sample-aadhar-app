const fs = require('fs')
const path = require('path')
const jsonwebtoken = require('jsonwebtoken')
const models = require('../models')
const config = require('../utils/config-helper')

const publicKey = fs.readFileSync(path.join(__dirname, '..', 'jwt/', `${config.getEnv()}`, '/jwtRS256.key.pub'))

module.exports = (req, res, next) => {
  if (req.signedCookies.token) {
    jsonwebtoken.verify(req.signedCookies.token, publicKey, {
      algorithms: ['RS256'],
    }, (err, decoded) => {
      if (err) {
        res.status(403).send(resGen.getObj(('Unauthorized')))
        return
      }
      
      const whereClause = []
      if (decoded.email) {
        whereClause.push({
          email: decoded.email,
        })
      }
      return models.User.findOne({
        where: whereClause,
        raw: true,
      }).then((user) => {
        if (!user) {
          throw new Error('No user Found!')
        }
        if (user.role !== 'USER' && user.role !== 'ADMIN') {
          throw new Error('Unauthorized, not a user')
        }
        req.user = user
        next()
      }).catch((error) => {
        console.error(error)
        res.status(403).send(resGen.getObj(error.message))
      })
    })
  } else {
    res.status(403).send(resGen.getObj(('Unauthorized')))
  }
}
