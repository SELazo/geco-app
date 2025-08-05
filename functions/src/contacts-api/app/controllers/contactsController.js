const newContactController = require('./contacts/newContactController');
const editContactController = require('./contacts/editContactController');
const deleteContactController = require('./contacts/deleteContactController');
const getContactController = require('./contacts/getContactController');
const getContactsListController = require('./contacts/getContactsListController');


const newContact = async (req, res, next) => {
    return newContactController(req, res, next);
};

const editContact = async (req, res, next) => {
    return editContactController(req, res, next);
};

const deleteContact = async (req, res, next) => {
    return deleteContactController(req, res, next);
};

const getContact = async (req, res, next) => {
    return getContactController(req, res, next);
};

const getContactsList = async (req, res, next) => {
    return getContactsListController(req, res, next);
};

module.exports = {
    newContact,
    editContact,
    deleteContact,
    getContact,
    getContactsList
};