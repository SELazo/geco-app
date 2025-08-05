const { Strategy, AdsByStrategy, GroupsByStrategy, Account } = require('../../repository/models');
const { InternalServerError, UnauthorizedError, NotFoundError } = require('../../errors');
const { headersUtils, basicSuccessResponse } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const deleteStrategyController = async (req, res, next) => {
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

    await GroupsByStrategy.destroy({
      where: { strategies_strategy_id: strategyId },
    });

    await AdsByStrategy.destroy({
      where: { strategies_strategy_id: strategyId },
    });

    await strategy.destroy();

    return res.json(basicSuccessResponse('Strategy and related records deleted successfully.'));
  } catch (err) {
    return next(new InternalServerError(`Error deleting strategy. Please try again later. Error: ${err}`));
  }
};

module.exports = deleteStrategyController;
