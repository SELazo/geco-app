const NodeCache = require('node-cache');
const cache = new NodeCache();

const setInCache = (key, value, ttl) => {
	cache.set(key, value, ttl);
};

const getFromCache = key => {
	return cache.get(key);
};

module.exports = {
	setInCache,
	getFromCache
};