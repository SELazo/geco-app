const { Ad, AdTemplates } = require('../../../repository/models');
const findAccountByUserId = require('./findAccountByUserId');
const { InternalServerError } = require('../../../errors');
const { parseAdDTO, parseAdTemplateDTO } = require('../../../utils');

const buildResponse = (ad, adTemplate) => ({
	...ad, 
	ad_template: adTemplate
});

const findAdsByUserId = async (userId) => {
	try {
		const account = await findAccountByUserId(userId);

		const ads = await Ad.findAll({
			where: {
				ad_account_id: account.account_id
			},
			attributes: {
			  exclude: ['ad_image']
			}
		});

		const adsDTO = ads.map(ad => parseAdDTO(ad.dataValues));

		const adsResponse = await Promise.all(adsDTO.map(async adDTO => {
			const adTemplate = await AdTemplates.findByPk(adDTO.templates_ad_temp_id);

			if (!adTemplate) {
				return null;
			}

			const adTemplateDTO = parseAdTemplateDTO(adTemplate.dataValues);
			return buildResponse(adDTO, adTemplateDTO);
		}));

		return adsResponse.filter(ad => ad !== null);
	} catch (err) {
		console.error(`Error searching ads by user_id: ${err}`);
		throw new InternalServerError('An error occurred while searching ads.');
	}
};

module.exports = findAdsByUserId;