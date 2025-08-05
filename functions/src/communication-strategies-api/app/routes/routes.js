const express = require('express');
const router = express.Router();
const { strategiesController, errorController } = require('../controllers');
const { newStrategy, getStrategy, getStrategiesList, editStrategy, deleteStrategy } = strategiesController;

router.post('/strategies', newStrategy);

router.get('/strategies/:strategyId', getStrategy);

router.get('/strategies/', getStrategiesList);

router.put('/strategies/:strategyId', editStrategy);

router.delete('/strategies/:strategyId', deleteStrategy);

router.use( errorController );

module.exports = router;