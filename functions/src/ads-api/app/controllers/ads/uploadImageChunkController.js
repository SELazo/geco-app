const { Ad } = require('../../repository/models');
const { InternalServerError } = require('../../errors');
const { validateRequiredParams, basicSuccessResponse, headersUtils } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const uploadImageChunkController = async (req, res, next) => {
	const { chunk } = req.body;
	const adId = req.params.adId;

	try {
		validateRequiredParams({ chunk });
		const token = headersUtils.getHeaderToken(req.headers);
		await validateSessionRestClient(token);
	} catch (e) {
		return next(e);
	}

	let ad;

	try {
		ad = await Ad.findOne({
			where: { ad_id: adId },
		});

		ad.ad_image = ad.ad_image ? ad.ad_image + chunk : chunk;

		await ad.save();

		return res.json(basicSuccessResponse('Ad_image updated successfully!'));
	} catch (err) {
		return next(new InternalServerError(`Error updating ad_image. Please try again later. Error: ${err}`));
	}
};

module.exports = uploadImageChunkController;
