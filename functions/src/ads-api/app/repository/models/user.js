const { DataTypes } = require('sequelize');
const { initializeSequelize } = require('../sequelize');  // ✅ Usar la función para obtener la instancia
const sequelize = initializeSequelize();  // ✅ Acá sí obtenés la instancia real

const User = sequelize.define('users', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  user_password: {
    type: DataTypes.STRING,
    validate: {
      len: [60, 60],
    },
  },
  user_deleted_date: {
    type: DataTypes.DATE,
  },
  user_created_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  user_flag_deleted: {
    type: DataTypes.TINYINT,
  },
}, {
  timestamps: false,
});

module.exports = User;
