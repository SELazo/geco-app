const newGroupController = require('./groups/newGroupController');
const getGroupController = require('./groups/getGroupController');
const getGroupsListController = require('./groups/getGroupsListController');
const editGroupController = require('./groups/editGroupController');
const deleteGroupController = require('./groups/deleteGroupController');
const addContactToGroupController = require('./groups/addContactToGroupController');
const deleteContactFromGroupController = require('./groups/deleteContactFromGroupController');

const newGroup = async (req, res, next) => {
    return newGroupController(req, res, next);
};

const getGroup = async (req, res, next) => {
    return getGroupController(req, res, next);
};

const getGroupsList = async (req, res, next) => {
    return getGroupsListController(req, res, next);
};

const editGroup = async (req, res, next) => {
    return editGroupController(req, res, next);
};

const deleteGroup = async (req, res, next) => {
    return deleteGroupController(req, res, next);
};

const addContactToGroup = async (req, res, next) => {
    return addContactToGroupController(req, res, next);
};

const deleteContactFromGroup = async (req, res, next) => {
    return deleteContactFromGroupController(req, res, next);
};

module.exports = {
    newGroup,
    getGroup,
    getGroupsList,
    editGroup,
    deleteGroup,
    addContactToGroup,
    deleteContactFromGroup
};