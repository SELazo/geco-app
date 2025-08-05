const routes = require('./routes');  // NO ./app/routes/routes, sino solo ./routes
const express = require('express');
const cors = require('cors');

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.use(routes);

module.exports = router;
