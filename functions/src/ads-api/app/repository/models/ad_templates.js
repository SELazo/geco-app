const { DataTypes } = require('sequelize');
const { initializeSequelize } = require('../sequelize');
const sequelize = initializeSequelize();

const AdTemplate = sequelize.define('ad_templates', {
	ad_temp_id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	ad_temp_color_text: {
		type: DataTypes.STRING,
		allowNull: true
	},
	ad_temp_type: {
		type: DataTypes.STRING,
		allowNull: true
	},
	ad_temp_disposition_pattern: {
		type: DataTypes.STRING,
		allowNull: true
	}
}, {
	timestamps: false
});

module.exports = AdTemplate;
