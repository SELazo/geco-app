import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';

const authRouter = require('./auth-service');
const adsRouter = require('./ads-api');
const contactsRouter = require('./contacts-api');
const strategiesRouter = require('./communication-strategies-api');

// Comentar para probar
// const { initializeSequelize } = require('./communication-strategies-api/app/repository/sequelize');
// initializeSequelize();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth-api', authRouter);
app.use('/ads-api', adsRouter);
app.use('/contacts-api', contactsRouter);
app.use('/communication-strategies-api', strategiesRouter);

// Force redeploy - Fixed strategies API params: match frontend request format - 2025-01-31 23:14
export const api = functions.https.onRequest(app);