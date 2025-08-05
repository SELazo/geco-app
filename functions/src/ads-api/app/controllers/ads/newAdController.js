const { Ad, AdTemplates } = require('../../repository/models');
const { InternalServerError } = require('../../errors');
const { validateRequiredParams, headersUtils, parseAdDTO, parseAdTemplateDTO } = require('../../utils');
const { validateSessionRestClient, findAccountByUserId } = require('../../services');

const buildResponse = (ad, adTemplate) => ({
	...ad, 
	ad_template: adTemplate
});

const newAdController = async (req, res, next) => {
	const { description, title, size, ad_template } = req.body;
	const { color_text, type, disposition_pattern } = ad_template;

	try {
		validateRequiredParams({ description, title, size });
		validateRequiredParams({ color_text, type, disposition_pattern });
	} catch (e) {
		return next(e);
	}

	try {

		const token = headersUtils.getHeaderToken(req.headers);
		const sessionData = await validateSessionRestClient(token);
		const account = await findAccountByUserId(sessionData.user.id);

		const currentDate = new Date();

		const adTemplate = await AdTemplates.create({
			ad_temp_color_text: color_text,
			ad_temp_type: type,
			ad_temp_disposition_pattern: disposition_pattern
		});

		const ad = await Ad.create({
			ad_templates_ad_temp_id: adTemplate.ad_temp_id,
			ad_description: description,
			ad_title: title,
			ad_size: size,
			ad_create_date: currentDate,
			ad_account_id: account.account_id
		});

		account.ads_ad_id = ad.ad_id;
		await account.save();
		
		const adDTO = parseAdDTO(ad.dataValues);
		delete adDTO.templates_ad_temp_id;

		const adTemplateDTO = parseAdTemplateDTO(adTemplate.dataValues);


		return res.json(buildResponse(adDTO, adTemplateDTO));
	} catch (err) {
		return next(new InternalServerError(`Error creating Ad and Ad_Template. Please try again later. Error: ${err}`));
	}
};

module.exports = newAdController;
