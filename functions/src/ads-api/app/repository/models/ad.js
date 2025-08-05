const {DataTypes} = require('sequelize');
const {initializeSequelize} = require('../sequelize');
const sequelize = initializeSequelize();

const Ad = sequelize.define('ads', {
	ad_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	ad_description: {
		type: DataTypes.STRING,
		allowNull: false
	},
	ad_title: {
		type: DataTypes.STRING,
		allowNull: false
	},
	ad_size: {
		type: DataTypes.STRING,
		allowNull: true
	},
	ad_image: {
		type: DataTypes.BLOB('long'),
		allowNull: true
	},
	ad_create_date: {
		type: DataTypes.DATE,
		allowNull: false
	},
	ad_deleted_date: {
		type: DataTypes.DATE,
		allowNull: true
	},
	ad_templates_ad_temp_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'ad_templates',
			key: 'ad_temp_id'
		}
	},
	ad_account_id: {
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

module.exports = Ad;
