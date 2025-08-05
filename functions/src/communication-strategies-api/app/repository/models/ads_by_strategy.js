const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
const { initializeSequelize } = require('../sequelize');
const sequelize = initializeSequelize();

const AdsByStrategy = sequelize.define('ads_by_strategy', {
  strategies_strategy_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'strategies',
      key: 'strategy_id'
    },
  },
  ads_ad_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'ads',
      key: 'ad_id'
    },
  },
  add_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('current_timestamp')
  },
  delete_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
}, {
  tableName: 'ads_by_strategy',
  timestamps: false
});

module.exports = AdsByStrategy;
