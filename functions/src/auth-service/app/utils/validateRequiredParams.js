const { BadRequestError } = require('../errors');

const isValidParam = param => !!param;

const hasRequiredParams = requiredParams => requiredParams.length > 0 && requiredParams.every( isValidParam);

const hasValidRequiredParams = requiredParams => requiredParams && hasRequiredParams( Object.values( requiredParams) );

const validateRequiredParams = requiredParams => {
	if (!hasValidRequiredParams( requiredParams ) ) {
		const missingParams = [];

		Object.entries( requiredParams ).forEach( ( [key, value] ) => {
			if ( !value ) {
				missingParams.push( key );
			}
		});

		throw new BadRequestError(`Missing required params --> ${missingParams}`);
	}
};

module.exports = validateRequiredParams;