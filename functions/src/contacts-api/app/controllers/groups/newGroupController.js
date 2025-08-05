const { Group, Contact, ContactsByGroup, Account } = require('../../repository/models');
const { InternalServerError, UnauthorizedError, NotFoundError } = require('../../errors');
const { validateRequiredParams, basicSuccessResponse, headersUtils } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const createGroupController = async (req, res, next) => {
  const { name, description, contacts } = req.body;
  let account;

  try {
    validateRequiredParams({ name, description, contacts });
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
    const group = await Group.create({
      group_name: name,
      group_description: description,
      accounts_account_id: account.account_id,
    });

    for (const contactId of contacts) {
      const contact = await Contact.findByPk(contactId);

      if (!contact) {
        return next(new NotFoundError(`Contact with ID ${contactId} not found.`));
      }

      if (contact.accounts_account_id !== account.account_id) {
        return next(new UnauthorizedError(`Contact with ID ${contactId} does not belong to the user.`));
      }

      await ContactsByGroup.create({
        groups_group_id: group.group_id,
        contacts_contact_id: contact.contact_id,
      });
    }

    return res.json(basicSuccessResponse('Group created successfully'));
  } catch (err) {
    return next(new InternalServerError(`Error creating group. Please try again later. Error: ${err}`));
  }
};

module.exports = createGroupController;
