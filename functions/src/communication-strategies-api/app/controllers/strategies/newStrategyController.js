const { Strategy, AdsByStrategy, GroupsByStrategy, Account, Ad, Group } = require('../../repository/models');
const { InternalServerError, UnauthorizedError, NotFoundError } = require('../../errors');
const { headersUtils, basicSuccessResponse } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const newStrategyController = async (req, res, next) => {
  const { name, start_date, end_date, periodicity, schedule, groups, ads } = req.body;
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
    const strategy = await Strategy.create({
      strategy_name: name,
      start_date,
      end_date,
      periodicity,
      schedule,
      accounts_account_id: account.account_id,
    });

    if (!strategy) {
      return next(new InternalServerError('Failed to create a new strategy.'));
    }

    for (const adId of ads) {
      const ad = await Ad.findByPk(adId);

      if (!ad) {
        return next(new NotFoundError(`Ad with ID ${adId} not found.`));
      }

      if (ad.ad_account_id !== account.account_id) {
        return next(new UnauthorizedError(`Ad with ID ${adId} does not belong to the user.`));
      }

      await AdsByStrategy.create({
        strategies_strategy_id: strategy.strategy_id,
        ads_ad_id: adId,
      });
    }

    for (const groupId of groups) {
      const group = await Group.findByPk(groupId);

      if (!group) {
        return next(new NotFoundError(`Group with ID ${groupId} not found.`));
      }

      if (group.accounts_account_id !== account.account_id) {
        return next(new UnauthorizedError(`Group with ID ${groupId} does not belong to the user.`));
      }

      await GroupsByStrategy.create({
        strategies_strategy_id: strategy.strategy_id,
        groups_group_id: groupId,
      });
    }

    return res.json(basicSuccessResponse('Strategy created successfully.'));
  } catch (err) {
    return next(new InternalServerError(`Error creating strategy. Please try again later. Error: ${err}`));
  }
};

module.exports = newStrategyController;
