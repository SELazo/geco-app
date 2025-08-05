const { Ad, AdTemplates } = require('../../repository/models');
const { InternalServerError, NotFoundError } = require('../../errors');
const { basicSuccessResponse, headersUtils } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const deleteAdAndTemplateController = async (req, res, next) => {
	const adId = req.params.adId;

	try {
		const ad = await Ad.findByPk(adId);
		const token = headersUtils.getHeaderToken(req.headers);
		await validateSessionRestClient(token);

		if (!ad) {
			return next(new NotFoundError('Ad not found'));
		}

		const adTemplateId = ad.ad_templates_ad_temp_id;

		await Ad.destroy({
			where: {
				ad_id: adId
			}
		});

		await AdTemplates.destroy({
			where: {
				ad_temp_id: adTemplateId
			}
		});

		return res.json(basicSuccessResponse('Ad and AdTemplate deleted successfully'));
	} catch (err) {
		return next(new InternalServerError(`Error deleting Ad and AdTemplate. Please try again later. Error: ${err}`));
	}
};

module.exports = deleteAdAndTemplateController;