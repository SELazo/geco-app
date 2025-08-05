const parseAdTemplateDTO = (adTemplatate) => Object.keys(adTemplatate).reduce((acc, key) => {
	const newKey = key.replace('ad_temp_', '');
	acc[newKey] = adTemplatate[key];
	return acc;
}, {});

module.exports = parseAdTemplateDTO;