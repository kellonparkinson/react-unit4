require("dotenv").config()
const { Sequelize } = require("sequelize")

const { DATABASE_URL } = process.env

const db = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
})

module.exports = { db }