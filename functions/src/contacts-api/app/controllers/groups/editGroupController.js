const { Group, Account } = require('../../repository/models');
const { InternalServerError, NotFoundError, UnauthorizedError } = require('../../errors');
const { validateRequiredParams, headersUtils, basicSuccessResponse } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const editGroupController = async (req, res, next) => {
  const groupId = req.params.groupId;
  const { name, description } = req.body;
  let account;

  try {
    validateRequiredParams({ name, description });
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

    await group.update({
      group_name: name,
      group_description: description,
    });

    return res.json(basicSuccessResponse('Group updated successfully.'));
  } catch (err) {
    return next(new InternalServerError(`Error editing group. Please try again later. Error: ${err}`));
  }
};

module.exports = editGroupController;
