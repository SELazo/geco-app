const { Strategy, AdsByStrategy, GroupsByStrategy, Account, Ad, Group } = require('../../repository/models');
const { InternalServerError, UnauthorizedError, NotFoundError } = require('../../errors');
const { headersUtils, basicSuccessResponse } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const editStrategyController = async (req, res, next) => {
  const strategyId = req.params.strategyId;
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
    const strategy = await Strategy.findByPk(strategyId);

    if (!strategy) {
      return next(new NotFoundError('Strategy not found.'));
    }

    if (strategy.accounts_account_id !== account.account_id) {
      return next(new UnauthorizedError(`Strategy with ID ${strategy.strategy_id} does not belong to the user.`))
    }

    await strategy.update({
      strategy_name: name,
      start_date,
      end_date,
      periodicity,
      schedule,
    });

    const currentAds = await AdsByStrategy.findAll({
      where: { strategies_strategy_id: strategyId },
    });

    for (const adId of ads) {
      const ad = await Ad.findByPk(adId);

      if (!ad) {
        return next(new NotFoundError(`Ad with ID ${adId} not found.`));
      }

      if (ad.ad_account_id !== account.account_id) {
        return next(new UnauthorizedError(`Ad with ID ${adId} does not belong to the user.`));
      }

      if (!currentAds.some((currentAd) => currentAd.ads_ad_id === adId)) {
        await AdsByStrategy.create({
          strategies_strategy_id: strategyId,
          ads_ad_id: adId,
        });
      }
    }

    for (const currentAd of currentAds) {
      if (!ads.includes(currentAd.ads_ad_id)) {
        await currentAd.destroy();
      }
    }

    const currentGroups = await GroupsByStrategy.findAll({
      where: { strategies_strategy_id: strategyId },
    });

    for (const groupId of groups) {
      const group = await Group.findByPk(groupId);

      if (!group) {
        return next(new NotFoundError(`Group with ID ${groupId} not found.`));
      }

      if (group.accounts_account_id !== account.account_id) {
        return next(new UnauthorizedError(`Group with ID ${groupId} does not belong to the user.`));
      }

      if (!currentGroups.some((currentGroup) => currentGroup.groups_group_id === groupId)) {
        await GroupsByStrategy.create({
          strategies_strategy_id: strategyId,
          groups_group_id: groupId,
        });
      }
    }

    for (const currentGroup of currentGroups) {
      if (!groups.includes(currentGroup.groups_group_id)) {
        await currentGroup.destroy();
      }
    }

    return res.json(basicSuccessResponse('Strategy updated successfully.'));
  } catch (err) {
    return next(new InternalServerError(`Error updating strategy. Please try again later. Error: ${err}`));
  }
};

module.exports = editStrategyController;
