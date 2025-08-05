const { DataTypes } = require('sequelize');
const { initializeSequelize } = require('../sequelize');
const sequelize = initializeSequelize();

const Account = sequelize.define('accounts', {
  account_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  account_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  account_price: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  users_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id',
    },
  },
  premium_premium_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'premium',
      key: 'premium_id',
    },
  },
}, {
  timestamps: false,
});

module.exports = Account;
