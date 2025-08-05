const { Contact, Account } = require('../../repository/models');
const { InternalServerError, NotFoundError, UnauthorizedError } = require('../../errors');
const { headersUtils, basicSuccessResponse } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const deleteContactController = async (req, res, next) => {
  const contactId = req.params.contactId;
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
    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return next(new NotFoundError('Contact not found'));
    }

    if (contact.accounts_account_id !== account.account_id) {
      return next(new UnauthorizedError('Unauthorized: Contact does not belong to the user.'));
    }

    await contact.destroy();

    return res.json(basicSuccessResponse('Contact deleted successfully'));
  } catch (err) {
    return next(new InternalServerError(`Error deleting contact. Please try again later. Error: ${err}`));
  }
};

module.exports = deleteContactController;
