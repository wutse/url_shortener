'use strict';

const express = require('express');
const router = express.Router();

const home = require('./modules/home');
router.use('/', home);

const urlShorteners = require('./modules/urlShorteners');
router.use('/urlShorteners', urlShorteners);

module.exports = router;