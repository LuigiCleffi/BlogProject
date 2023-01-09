const Sequelize = require("sequelize")
const config = require("./config.js")

const connection = new Sequelize(config.database, config.username, config.password, {
    host: config.host, 
    port: config.port,
    dialect: 'mysql'
})

module.exports = connection