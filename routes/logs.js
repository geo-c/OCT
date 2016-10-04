var express = require('express');
var router = express.Router();

var list = require('../controllers/logs/list');
var countByDay = require('../controllers/logs/countByDay');
var byTag = require('../controllers/logs/byTag');
var byCategory = require('../controllers/logs/byCategory');
var byDataset = require('../controllers/logs/byDataset');

// LIST
router.get('/apps/:app_hash/logs', list.request);

// Count of Logs by Day
router.get('/logs/countByDay', countByDay.request);

//Logs of Tags by App
router.get('/apps/:app_hash/logsByTag', byTag.request);

//Logs of Categories by App
router.get('/apps/:app_hash/logsByCategory', byCategory.request);

router.get('/apps/:app_hash/logsByDataset', byDataset.request);

// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE


module.exports = router;
