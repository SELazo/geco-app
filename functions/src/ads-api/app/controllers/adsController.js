const newAdController = require('./ads/newAdController');
const uploadImageChunkController = require('./ads/uploadImageChunkController');
const getAdImageController = require('./ads/getAdImageController');
const getAdController = require('./ads/getAdController');
const getAdsListController = require('./ads/getAdsListController');
const editAdController = require('./ads/editAdController');
const deleteAdController = require('./ads/deleteAdController');

const newAd = async (req, res, next) => {
	return newAdController(req, res, next);
};

const getAdImage = async (req,res,next) => {
	return getAdImageController(req, res, next);
};

const uploadImageChunk = async (req, res, next) => {
	return uploadImageChunkController(req, res, next);
};

const getAd = async (req, res, next) => {
	return getAdController(req, res, next);
};

const getAdsList = async (req, res, next) => {
	return getAdsListController(req, res, next);
};

const editAd = async (req, res, next) => {
	return editAdController(req, res, next);
};

const deleteAd = async (req, res, next) => {
	return deleteAdController(req, res, next);
};


module.exports = {
	newAd,
	uploadImageChunk,
	getAdImage,
	getAd,
	getAdsList,
	editAd,
	deleteAd,
};