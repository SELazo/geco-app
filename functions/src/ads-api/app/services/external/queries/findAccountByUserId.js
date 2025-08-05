const { Account } = require('../../../repository/models');
const { InternalServerError } = require('../../../errors');

const findAccountByUserId = async (userId) => {
	try {
		const account = await Account.findOne({
			where: {
				users_user_id: userId
			}
		});

		return account;
	} catch (err) {
		console.error(`Error searching account by user_id: ${err}`);
		throw new InternalServerError('An error occurred while searching for the account.');
	}
};

module.exports = findAccountByUserId;