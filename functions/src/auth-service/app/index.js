const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // o './routes/index.js'

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.use(routes);

module.exports = router;