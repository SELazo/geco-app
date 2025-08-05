const { InternalServerError } = require('../../errors');
const { headersUtils } = require('../../utils');
const { validateSessionRestClient, findAdsByUserId } = require('../../services');

const getGroupsListController = async (req, res, next) => {
	let userId;
	try {
		const token = headersUtils.getHeaderToken(req.headers);
		const sessionData = await validateSessionRestClient(token);
		userId = sessionData.user.id;
	} catch (e) {
		return next(e);
	}
  
	try {

		const ads = await findAdsByUserId(userId);

		return res.json(ads);
	} catch (err) {
		return next(new InternalServerError(`Error retrieving ads. Please try again later. Error: ${err}`));
	}
};

module.exports = getGroupsListController;