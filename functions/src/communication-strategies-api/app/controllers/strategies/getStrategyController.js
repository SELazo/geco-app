const { Account, Strategy, AdsByStrategy, GroupsByStrategy } = require('../../repository/models');
const { InternalServerError, UnauthorizedError, NotFoundError } = require('../../errors');
const { headersUtils, parseStrategyDTO } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const getStrategyController = async (req, res, next) => {
  const strategyId = req.params.strategyId;
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

    return res.json(parseStrategyDTO(strategy.dataValues, ads, groups));
  } catch (err) {
    return next(new InternalServerError(`Error retrieving strategy. Please try again later. Error: ${err}`));
  }
};

module.exports = getStrategyController;
