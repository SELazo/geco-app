const parseContactDTO = (contact) => Object.keys(contact).reduce((acc, key) => {
        const newKey = key.replace("contact_", "").replace("accounts_", "");
        acc[newKey] = contact[key];
        return acc;
    }, {});

module.exports = parseContactDTO;