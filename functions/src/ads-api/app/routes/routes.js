const express = require('express');
const router = express.Router();
const { adsController, errorController } = require('../controllers');
const { newAd, uploadImageChunk, getAdImage, getAd, getAdsList, editAd, deleteAd } = adsController;

router.post('/ads', newAd);

router.post('/ads/:adId/upload-image-chunk', uploadImageChunk);

router.get('/ads/:adId/image', getAdImage);

router.get('/ads/:adId', getAd);

router.get('/ads', getAdsList);

router.put('/ads/:adId', editAd);

router.delete('/ads/:adId', deleteAd);

router.use( errorController );

module.exports = router;