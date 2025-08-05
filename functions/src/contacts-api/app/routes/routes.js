const express = require('express');
const router = express.Router();
const { errorController, contactsController, groupsController } = require('../controllers');
const contactsRoutes = require('./contactsRoutes');
const groupsRoutes = require('./groupsRoutes');
const { newContact } = contactsController;
const { newGroup } = groupsController;

router.use('/contacts', contactsRoutes);

router.use('/groups', groupsRoutes);

router.post('/directories/contacts', newContact);

router.post('/directories/groups', newGroup);

router.use( errorController );

module.exports = router;