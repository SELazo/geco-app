const { Contact, Account } = require('../../repository/models');
const { InternalServerError, NotFoundError, UnauthorizedError } = require('../../errors');
const { validateRequiredParams, headersUtils, parseContactDTO } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const getContactController = async (req, res, next) => {
  const contactId = req.params.contactId;
  let sessionData;

  try {
    validateRequiredParams({ contactId });
    const token = headersUtils.getHeaderToken(req.headers);
    sessionData = await validateSessionRestClient(token);
  } catch (e) {
    return next(e);
  }

  try {
    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return next(new NotFoundError('Contact not found'));
    }

    const account = await Account.findOne({
      where: { users_user_id: sessionData.user.id },
    });

    if (!account) {
      return next(new UnauthorizedError('Unauthorized: Account not found for the user.'));
    }

    if (contact.accounts_account_id !== account.account_id) {
      return next(new UnauthorizedError('Unauthorized: Contact does not belong to the user.'));
    }

    const contactDTO = parseContactDTO(contact.dataValues);

    return res.json(contactDTO);
  } catch (err) {
    return next(new InternalServerError(`Error retrieving contact. Please try again later. Error: ${err}`));
  }
};

module.exports = getContactController;
