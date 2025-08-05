const { Group, ContactsByGroup, Account } = require('../../repository/models');
const { InternalServerError, UnauthorizedError, NotFoundError } = require('../../errors');
const { headersUtils, basicSuccessResponse } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const deleteGroupController = async (req, res, next) => {
  const groupId = req.params.groupId;
  let account;

  try {
    const token = headersUtils.getHeaderToken(req.headers);
    const sessionData = await validateSessionRestClient(token);
    account = await Account.findOne({
      where: { users_user_id: sessionData.user.id },
    });

    if (!account) {
      return next(new UnauthorizedError('Unauthorized: Account not found for the user.'));
    }
  } catch (e) {
    return next(e);
  }

  try {
    const group = await Group.findByPk(groupId);

    if (!group) {
      return next(new NotFoundError('Group not found.'));
    }

    if (group.accounts_account_id !== account.account_id) {
      return next(new UnauthorizedError('Unauthorized: Group does not belong to the user.'));
    }

    await ContactsByGroup.destroy({
      where: {
        groups_group_id: groupId,
      },
    });

    await group.destroy();

    return res.json(basicSuccessResponse('Group deleted successfully.'));
  } catch (err) {
    return next(new InternalServerError(`Error deleting group. Please try again later. Error: ${err}`));
  }
};

module.exports = deleteGroupController;
