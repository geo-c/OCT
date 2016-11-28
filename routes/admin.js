var express = require('express');
var router = express.Router();

var signup = require('../controllers/admin/signup');
var login = require('../controllers/admin/login');


//Create a new admin account
router.post('/admin/signup', signup.request);

//Log in to an existing admin acount
router.get('/admin/login/:username/:password', login.request);


module.exports = router;
