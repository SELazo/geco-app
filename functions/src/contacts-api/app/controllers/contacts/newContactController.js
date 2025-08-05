const { Contact, Account } = require('../../repository/models');
const { InternalServerError } = require('../../errors');
const { validateRequiredParams, basicSuccessResponse, headersUtils } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const newContactController = async (req, res, next) => {
  const { name, email, phone } = req.body;

  try {
    validateRequiredParams({ name, email, phone });
  } catch (e) {
    return next(e);
  }

  try {
    const token = headersUtils.getHeaderToken(req.headers);
    const sessionData = await validateSessionRestClient(token);

    const account = await Account.findOne({
      where: { users_user_id: sessionData.user.id },
    });

    if (!account) {
      return next(new InternalServerError('Account not found for the user.'));
    }

    await Contact.create({
      contact_name: name,
      contact_email: email,
      contact_phone: phone,
      accounts_account_id: account.account_id,
    });

    return res.json(basicSuccessResponse('Contact created successfully'));
  } catch (err) {
    return next(new InternalServerError(`Error creating contact. Please try again later. Error: ${err}`));
  }
};

module.exports = newContactController;
