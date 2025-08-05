const { Group, ContactsByGroup, Contact, Account } = require('../../repository/models');
const { InternalServerError, UnauthorizedError, NotFoundError } = require('../../errors');
const { headersUtils, parseGroupDTO, parseContactDTO } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const buildResponse = (group, contacts) => ({
  group, 
  contacts
});

const getGroupController = async (req, res, next) => {
  const groupId = req.params.groupId;
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
      return next(new NotFoundError('Group not found.'));
    }

    if (group.accounts_account_id !== account.account_id) {
      return next(new UnauthorizedError('Unauthorized: Group does not belong to the user.'));
    }

    const contactsByGroup = await ContactsByGroup.findAll({
      where: {
        groups_group_id: groupId,
      },
    });

    if (!contactsByGroup || contactsByGroup.length === 0) {
      return next(new NotFoundError('Empty group.'));
    }

    const contactIds = contactsByGroup.map((item) => item.contacts_contact_id);

    const contacts = await Contact.findAll({
      where: {
        contact_id: contactIds,
      },
    });

    const groupDTO = parseGroupDTO(group.dataValues);
    const contactsDTO = contacts.map(contact => parseContactDTO(contact.dataValues));

    return res.json(buildResponse(groupDTO, contactsDTO));
  } catch (err) {
    return next(new InternalServerError(`Error retrieving group. Please try again later. Error: ${err}`));
  }
};

module.exports = getGroupController;
