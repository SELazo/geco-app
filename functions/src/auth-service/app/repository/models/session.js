const { DataTypes } = require('sequelize');
const { initializeSequelize } = require('../sequelize');
const sequelize = initializeSequelize();

const Session = sequelize.define('Session', {
  session_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  session_start: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  session_end: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  users_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'user_id',
    },
  },
}, {
  tableName: 'sessions',
  timestamps: false,
});

module.exports = Session;
