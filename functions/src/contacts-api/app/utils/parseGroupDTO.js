const parseGroupDTO = (group) => Object.keys(group).reduce((acc, key) => {
    const newKey = key.replace("group_", "").replace("accounts_", "");
    acc[newKey] = group[key];
    return acc;
}, {});

module.exports = parseGroupDTO;