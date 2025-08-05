const { Session } = require('../../../repository/models');
const { InternalServerError } = require('../../../errors');

const findActiveSession = async (userId) => {
	try {
		const session = await Session.findOne({
			where: {
				users_user_id: userId,
				session_end: null
			}
		});

		return session;
	} catch (err) {
		console.error(`Error searching active session for user_id: ${err}`);
		throw new InternalServerError('An error occurred while searching for active session.');
	}
};

module.exports = findActiveSession;