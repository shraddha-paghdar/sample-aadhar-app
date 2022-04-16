const devConfig = require('../config/development.config.json')
const prodConfig = require('../config/production.config.json')

/**
 * Get the correct configuration for different environments
 */

module.exports.getConfig = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return devConfig

    case 'production':
      return prodConfig

    default:
      return devConfig
  }
}

module.exports.getEnv = () => process.env.NODE_ENV || 'development'
