const { DataTypes } = require('sequelize');
const { initializeSequelize } = require('../sequelize');
const sequelize = initializeSequelize();

const Strategy = sequelize.define('strategies', {
  strategy_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  strategy_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  periodicity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  schedule: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  accounts_account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'account_id'
    },
  },
}, {
  tableName: 'strategies',
  timestamps: false
});

module.exports = Strategy;
