var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../config/secret');
var db_settings = require('../server.js').db_settings;
var errors = require('./../config/errors');

var Ajv = require('ajv');
var schema = require('./../models/login');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);


// POST
exports.request = function(req, res){

    // Check if Header contains Access-Token
    if(!req.headers.authorization || req.headers.authorization === ""){
        res.status(errors.authentication.error_2.code).send(errors.authentication.error_2);
        return console.error(errors.authentication.error_2.message);
    } else {

        // Verify Access-Token
        jwt.verify(req.headers.authorization, secret.key, function(err, decoded) {
            if (err) {
                res.status(errors.authentication.error_1.code).send(errors.authentication.error_1);
                return console.error(errors.authentication.error_1.message);
            } else {
                console.log(decoded.app_name);

                // TODO:
                // - Find app_name in Apps-Table
                // - Log app_name in Logs-Table
                // - Find results for query
            }
            
        });
    }
};
