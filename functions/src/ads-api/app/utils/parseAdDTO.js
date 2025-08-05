const parseAdDTO = (ad) => Object.keys(ad).reduce((acc, key) => {
	const newKey = key.replace('ad_', '');
	acc[newKey] = ad[key];
	return acc;
}, {});

module.exports = parseAdDTO;