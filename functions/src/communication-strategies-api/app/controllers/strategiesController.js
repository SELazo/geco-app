const newStrategyController = require('./strategies/newStrategyController');
const editStrategyController = require('./strategies/editStrategyController');
const deleteStrategyController = require('./strategies/deleteStrategyController');
const getStrategyController = require('./strategies/getStrategyController');
const getStrategiesListController = require('./strategies/getStrategiesListController');


const newStrategy = async (req, res, next) => {
    return newStrategyController(req, res, next);
};

const editStrategy = async (req, res, next) => {
    return editStrategyController(req, res, next);
};

const deleteStrategy = async (req, res, next) => {
    return deleteStrategyController(req, res, next);
};

const getStrategy = async (req, res, next) => {
    return getStrategyController(req, res, next);
};

const getStrategiesList = async (req, res, next) => {
    return getStrategiesListController(req, res, next);
};

module.exports = {
    newStrategy,
    editStrategy,
    deleteStrategy,
    getStrategy,
    getStrategiesList
};