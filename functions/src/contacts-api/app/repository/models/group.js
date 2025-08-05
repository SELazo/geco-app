const { DataTypes } = require('sequelize');
const { initializeSequelize } = require('../sequelize');
const sequelize = initializeSequelize();

const Group = sequelize.define('groups', {
  group_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  group_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  group_description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  accounts_account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'accounts',
      key: 'account_id'
    }
  }
}, {
  timestamps: false
});

module.exports = Group;
