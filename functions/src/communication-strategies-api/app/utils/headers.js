const getHeaderToken = (headers) => {
    return headers.authorization.split(' ')[1];
};

module.exports = {
    getHeaderToken
};