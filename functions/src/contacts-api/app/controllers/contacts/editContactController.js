const { Contact, Account } = require('../../repository/models');
const { InternalServerError, NotFoundError, UnauthorizedError } = require('../../errors');
const { validateRequiredParams, basicSuccessResponse, headersUtils } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const editContactController = async (req, res, next) => {
  const contactId = req.params.contactId;
  const { name, email, phone } = req.body;
  let account;

  try {
    validateRequiredParams({ name, email, phone });
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
    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return next(new NotFoundError('Contact not found'));
    }

    if (contact.accounts_account_id !== account.account_id) {
      return next(new UnauthorizedError('Unauthorized: Contact does not belong to the user.'));
    }

    await contact.update({
      contact_name: name,
      contact_email: email,
      contact_phone: phone,
    });

    return res.json(basicSuccessResponse('Contact updated successfully'));
  } catch (err) {
    return next(new InternalServerError(`Error editing contact. Please try again later. Error: ${err}`));
  }
};

module.exports = editContactController;
