const { Op } = require('sequelize');
const { Strategy, AdsByStrategy, GroupsByStrategy, Account } = require('../../repository/models');
const { InternalServerError, UnauthorizedError } = require('../../errors');
const { headersUtils, parseStrategyDTO } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const getStrategiesListController = async (req, res, next) => {
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
    const whereClause = { accounts_account_id: account.account_id };

    if (queryParams.name) {
      whereClause.strategy_name = {
        [Op.like]: `%${queryParams.name}%`,
      };
    }

    const strategies = await Strategy.findAll({
      where: whereClause,
    });

    const strategyDTOs = [];

    for (const strategy of strategies) {
      const strategyId = strategy.strategy_id;

      const adsByStrategy = await AdsByStrategy.findAll({
        where: { strategies_strategy_id: strategyId },
        attributes: ['ads_ad_id'],
      });

      const groupsByStrategy = await GroupsByStrategy.findAll({
        where: { strategies_strategy_id: strategyId },
        attributes: ['groups_group_id'],
      });

      const ads = adsByStrategy.map((adsByStrat) => adsByStrat.ads_ad_id);
      const groups = groupsByStrategy.map((groupsByStrat) => groupsByStrat.groups_group_id);

      strategyDTOs.push(parseStrategyDTO(strategy.dataValues, ads, groups));
    }

    return res.json(strategyDTOs);
  } catch (err) {
    return next(new InternalServerError(`Error retrieving strategies. Please try again later. Error: ${err}`));
  }
};

module.exports = getStrategiesListController;
