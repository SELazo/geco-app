const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
const { initializeSequelize } = require('../sequelize');
const sequelize = initializeSequelize();

const ContactsByGroup = sequelize.define('contacts_by_group', {
  groups_group_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'groups',
      key: 'group_id',
    },
  },
  contacts_contact_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'contacts',
      key: 'contact_id',
    },
  },
  add_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('current_timestamp'),
  },
  delete_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'contacts_by_group',
  timestamps: false,
});

module.exports = ContactsByGroup;
