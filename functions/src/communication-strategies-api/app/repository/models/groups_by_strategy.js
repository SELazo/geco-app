const Sequelize = require('sequelize');
const { DataTypes } = Sequelize;
const { initializeSequelize } = require('../sequelize');
const sequelize = initializeSequelize();

const GroupsByStrategy = sequelize.define('groups_by_strategy', {
  strategies_strategy_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'strategies',
      key: 'strategy_id'
    },
  },
  groups_group_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'groups',
      key: 'group_id'
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
  tableName: 'groups_by_strategy',
  timestamps: false
});

module.exports = GroupsByStrategy;
