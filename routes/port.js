var express = require('express');
var router = express.Router();

var port = require('../controllers/port');


//Get all apps
router.get('/port', port.request);

module.exports = router;
