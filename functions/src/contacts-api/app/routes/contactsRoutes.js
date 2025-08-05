const express = require('express');
const router = express.Router();
const { errorController, contactsController } = require('../controllers');
const { editContact, deleteContact, getContact, getContactsList } = contactsController;

router.get('/:contactId', getContact);

router.get('/', getContactsList);

router.put('/:contactId', editContact);

router.delete('/:contactId', deleteContact);

module.exports = router;