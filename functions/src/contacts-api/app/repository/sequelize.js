const { Sequelize } = require('sequelize');
const functions = require('firebase-functions');

let sequelize;

function initializeSequelize() {
  if (!sequelize) {
    sequelize = new Sequelize(
      functions.config().mysql.database,
      functions.config().mysql.user,
      functions.config().mysql.password,
      {
        host: functions.config().mysql.host,
        dialect: 'mysql',
        port: 3306,
        logging: false,
      }
    );
  }
  return sequelize;
}

module.exports = {
  initializeSequelize,
  getSequelize: () => sequelize,
};
