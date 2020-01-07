const envConfig = require('./env-config')
const versionConfig = require('./version-config')
const paramConfig = require('./param-config')

module.exports = {
  ...envConfig,
  ...paramConfig,
  ...versionConfig
}