const { Ad, AdTemplates } = require('../../repository/models');
const { InternalServerError, NotFoundError, UnauthorizedError } = require('../../errors');
const { validateRequiredParams, headersUtils, parseAdDTO, parseAdTemplateDTO } = require('../../utils');
const { validateSessionRestClient, findAccountByUserId } = require('../../services');

const buildResponse = (ad, adTemplate) => ({
	...ad, 
	ad_template: adTemplate
});

const editAdController = async (req, res, next) => {
	const adId = req.params.adId;
	const { title, description } = req.body;
	let userId;

	try {
		validateRequiredParams({ adId });
		const token = headersUtils.getHeaderToken(req.headers);
		const session = await validateSessionRestClient(token);
		userId = session.user.id;
	} catch (e) {
		return next(e);
	}

	try {
		const account = await findAccountByUserId(userId);

		if (!account) {
			return next(new InternalServerError('No account found for this user.'));
		}

		const ad = await Ad.findByPk(adId, {
			attributes: {
			  exclude: ['ad_image']
			}
		});

		if (!ad) {
			return next(new NotFoundError('Ad not found.'));
		}

		if (account.account_id !== ad.ad_account_id) {
			return next(new UnauthorizedError('This ad does not belong to this user.'));
		}
		
		const adTempId = ad.ad_templates_ad_temp_id;
		const adTemplate = await AdTemplates.findByPk(adTempId);

		if (!adTemplate) {
			return next(new NotFoundError('Ad template not found.'));
		}

		const adTemplateDTO = parseAdTemplateDTO(adTemplate.dataValues);

		await ad.update({
			ad_title: title,
			ad_description: description,
		});

		const adDTO = parseAdDTO(ad.dataValues);

		delete adDTO.templates_ad_temp_id;

		return res.json(buildResponse(adDTO, adTemplateDTO));
	} catch (err) {
		return next(new InternalServerError(`Error editing Ad. Please try again later. Error: ${err}`));
	}
};

module.exports = editAdController;
