/* global Buffer */
const stream = require('stream');
const { Ad } = require('../../repository/models');
const { NotFoundError } = require('../../errors');
const { validateRequiredParams, headersUtils } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const getAdImageController = async (req, res, next) => {
	const { adId } = req.params;

	try {
		validateRequiredParams({ adId });
		const token = headersUtils.getHeaderToken(req.headers);
		await validateSessionRestClient(token);
	} catch (e) {
		return next(e);
	}

	try {
		const ad = await Ad.findByPk(adId);

		if (!ad) {
			throw new NotFoundError('Ad not found.');
		}

		if (!ad.ad_image) {
			throw new NotFoundError('Ad not found.');
		}

		const strB64 = ad.ad_image.toString();

		const imageBuffer = Buffer.from(strB64, 'base64');

		const readStream = new stream.PassThrough();
		readStream.end(imageBuffer);

		res.setHeader('Content-Disposition', 'attachment; filename="image.jpg"');
		res.setHeader('Content-Type', 'image/jpg');

		return readStream.pipe(res);
	} catch (err) {
		return next(err);
	}
};

module.exports = getAdImageController;
    