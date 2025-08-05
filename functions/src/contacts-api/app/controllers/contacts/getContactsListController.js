const { Op } = require('sequelize');
const { Contact, Account } = require('../../repository/models');
const { InternalServerError, UnauthorizedError } = require('../../errors');
const { headersUtils, parseContactDTO } = require('../../utils');
const { validateSessionRestClient } = require('../../services');

const getContactsListController = async (req, res, next) => {
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
      whereClause.contact_name = {
        [Op.like]: `%${queryParams.name}%`,
      };
    }

    if (queryParams.email) {
      whereClause.contact_email = queryParams.email;
    }

    if (queryParams.phone) {
      whereClause.contact_phone = queryParams.phone;
    }

    const contacts = await Contact.findAll({
      where: whereClause,
    });

    const contactDTOs = contacts.map((contact) => parseContactDTO(contact.dataValues));

    return res.json(contactDTOs);
  } catch (err) {
    return next(new InternalServerError(`Error retrieving contacts. Please try again later. Error: ${err}`));
  }
};

module.exports = getContactsListController;
