const Sequelize = require("sequelize");
const { PASSWORD } = require("../constants/global");

const sequelize = new Sequelize("node-complete", "root", PASSWORD, {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
