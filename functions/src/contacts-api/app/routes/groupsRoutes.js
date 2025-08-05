const express = require('express');
const router = express.Router();
const { groupsController } = require('../controllers');
const { getGroup, getGroupsList, editGroup, deleteGroup, addContactToGroup, deleteContactFromGroup } = groupsController;

router.get('/:groupId', getGroup);

router.get('/', getGroupsList);

router.put('/:groupId', editGroup);

router.delete('/:groupId', deleteGroup);

router.delete('/:groupId/contacts/:contactId', deleteContactFromGroup);

router.post('/:groupId/contacts/:contactId', addContactToGroup);

module.exports = router;