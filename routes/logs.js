var express = require('express');
var router = express.Router();

var list = require('../controllers/logs/list');
var byDay = require('../controllers/logs/byDay');
var getCountsByDay = require('../controllers/logs/getCountsByDay');
var byTag = require('../controllers/logs/byTag');
var byCategory = require('../controllers/logs/byCategory');
var byDataset = require('../controllers/logs/byDataset');
var visitor = require ('../controllers/logs/visitor');
var visitors = require('../controllers/logs/getVisitors');

// LIST
router.get('/apps/:app_hash/logs', list.request);

// Count of Logs by Day
router.get('/logs/byDay', byDay.request);
router.get('/logs/byDay/:date', getCountsByDay.request);

//Logs of Tags by App
router.get('/apps/:app_hash/logsByTag', byTag.request);

//Logs of Categories by App
router.get('/apps/:app_hash/logsByCategory', byCategory.request);

router.get('/apps/:app_hash/logsByDataset', byDataset.request);

router.post('/visitor', visitor.request);

router.get('/visitors', visitors.request);

router.get('/visitors/:status/:value', visitors.request);

router.get('/visitors/:status/:value/:timeFrom', visitors.request);

router.get('/visitors/:status/:value/:timeFrom/:timeTo', visitors.request);


// TODO:
// POST
// DELETE ALL
// GET
// PUT
// DELETE


module.exports = router;
