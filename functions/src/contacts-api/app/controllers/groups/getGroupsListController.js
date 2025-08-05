const { Op } = require('sequelize');
const { Group, Account } = require('../../repository/models');
const { InternalServerError, UnauthorizedError } = require('../../errors');
const { headersUtils, parseGroupDTO } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const getGroupsListController = async (req, res, next) => {
  const queryParams = req.query;
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
    const whereClause = {
      accounts_account_id: account.account_id,
    };

    if (queryParams.name) {
      whereClause.group_name = {
        [Op.like]: `%${queryParams.name}%`,
      };
    }

    const groups = await Group.findAll({
      where: whereClause,
    });

    const groupDTOs = groups.map(group => parseGroupDTO(group.dataValues));

    return res.json(groupDTOs);
  } catch (err) {
    return next(new InternalServerError(`Error retrieving groups. Please try again later. Error: ${err}`));
  }
};

module.exports = getGroupsListController;
