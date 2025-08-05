const { Group, ContactsByGroup, Contact, Account } = require('../../repository/models');
const { InternalServerError, UnauthorizedError, NotFoundError, BadRequestError } = require('../../errors');
const { headersUtils, basicSuccessResponse } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const deleteContactFromGroupController = async (req, res, next) => {
  const groupId = req.params.groupId;
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
    const group = await Group.findByPk(groupId);

    if (!group) {
      return next(new NotFoundError('Group not found'));
    }

    if (group.accounts_account_id !== account.account_id) {
      return next(new UnauthorizedError('Unauthorized: Group does not belong to the user.'));
    }

    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return next(new NotFoundError('Contact not found'));
    }

    if (contact.accounts_account_id !== account.account_id) {
      return next(new UnauthorizedError('Unauthorized: Contact does not belong to the user.'));
    }

    const existingContact = await ContactsByGroup.findOne({
      where: {
        groups_group_id: groupId,
        contacts_contact_id: contactId,
      },
    });

    if (!existingContact) {
      return next(new BadRequestError('BadRequest: Contact is not in the group.'));
    }

    await existingContact.destroy();

    return res.json(basicSuccessResponse('Contact removed from the group successfully'));
  } catch (err) {
    return next(new InternalServerError(`Error removing contact from the group. Please try again later. Error: ${err}`));
  }
};

module.exports = deleteContactFromGroupController;
