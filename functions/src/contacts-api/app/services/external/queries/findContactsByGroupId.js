const { DirectoryByGroups, DirectoryByContact, Contact } = require('../../../repository/models');
const { InternalServerError } = require('../../../errors');

const findContactsByGruoupId = async (groupId) => {
    try {
        const directoriesByGroup = await DirectoryByGroups.findAll({
            where: {
                groups_group_id: groupId
            }
        });

        const directoriesId = directoriesByGroup.map(directoryByGroup => directoryByGroup.directories_directory_id);

        if (directoriesId.length === 0) {
            throw new InternalServerError(`Directories not found for groupId: ${groupId}`)
        }

        const contactsId = await Promise.all(directoriesId.map(async directoryId => {
            const data = await DirectoryByContact.findOne({
                where: {
                    directories_directory_id: directoryId
                }
            });

            const directoryByContact = data.get({ plain: true });

            return directoryByContact.contacts_contact_id;
        }));

        if (contactsId.length === 0) {
            throw new InternalServerError(`Contacts not found for groupId: ${groupId}`)
        }

        const contacts = await Promise.all(contactsId.map(async contactId => {
            const data = await Contact.findByPk(contactId);
            const contact = data.get({ plain: true });
            return contact;
        }));

        return contacts;
    } catch (err) {
        console.error(`Error searching contacts by group_id: ${err}`);
        throw new InternalServerError(`An error occurred while searching for contacts. Error: ${err}`);
    }
};

module.exports = findContactsByGruoupId;