const { DataTypes } = require('sequelize');
const { initializeSequelize } = require('../sequelize');
const sequelize = initializeSequelize();

const Contact = sequelize.define('contacts', {
  contact_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contact_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contact_phone: {
    type: DataTypes.BIGINT,
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

module.exports = Contact;
