var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');

var Ajv = require('ajv');
var schema = require('./../../models/visitor');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);


exports.request = function(req, res) {
	var valid = validate(req.body);
	if (!valid) {
		res.status(errors.schema.error_1.code).send(_.extend(errors.schema.error_1, {
			err: validate.errors[0].dataPath + ": " + validate.errors[0].message
		}));
		return console.error(validate.errors[0].dataPath + ": " + validate.errors[0].message);
	} else {
		var queryStr = "INSERT INTO visitors (date, city, country_code, country_name, latitude, longitude, metro_code, region_code, region_name, time_zone, zip_code) VALUES (now(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
		var params = [
			req.body.city,
    		req.body.country_code,
    		req.body.country_name,
    		req.body.latitude,
    		req.body.longitude,
    		req.body.metro_code,
    		req.body.region_code,
    		req.body.region_name,
    		req.body.time_zone,
    		req.body.zip_code
		]

	    client.query(queryStr, params, function (err, result) {
	        if(err) {
	            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
	            return console.error(errors.database.error_2.message, err);
	        } else {
	        	res.status(200).send({message:"OK"});
	        }
	    });

	}
};