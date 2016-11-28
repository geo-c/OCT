var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');

var path = require('path');
var fs = require('fs');
var mustache = require('mustache');

var Ajv = require('ajv');
var schema = require('./../../models/dataset');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);

var request = require('request');
var CouchDB_Client = require('../connectors/CouchDB_Client.js');
var Postgres_Client = require('../connectors/Postgres_Client.js');
var Parliament_Client = require('../connectors/Parliament_Client.js');



// POST
exports.request = function(req, res) {

	// Schema Validation
	var valid = validate(req.body);
	if (!valid) {
		res.status(errors.schema.error_1.code).send(_.extend(errors.schema.error_1, {
			err: validate.errors[0].dataPath + ": " + validate.errors[0].message
		}));
		return console.error(validate.errors[0].dataPath + ": " + validate.errors[0].message);
	} else {
        console.log(req.body)
    	switch(req.body.ds_type) {
    		case('REST'):
    			_url = req.body.ds_host;
                if(req.body.ds_port != null && req.body.ds_port != "") {
                    _url += ":" + req.body.ds_port + "/";
                }
                _url += req.body.query_intern;
                try {
                    request(_url, function(error, response, body) {
                        if(error) {
                            res.status(400).send(error);
                        } else {
                            //Check if valid JSON
                            JSON.parse(body);
                            res.status(200).send(true);
                        }
                    });
                } catch(e) {
                    res.status(400).send(e);
                }
    			break;
			case('COUCHDB'):
                var couchdb_Client = new CouchDB_Client(req.body.ds_host, req.body.ds_port);
                couchdb_Client.useDatabase(req.body.db_instance);
                couchdb_Client.query(req.body.query_intern, function (error, result) {
                    if(error) {
                        console.log(error);
                        res.send(error);
                    } else {
                        console.log(result);
                        res.send(result);
                    }
                });
    			break;
			case('PARLIAMENT'):
				var parliament_Client = new Parliament_Client(req.body.ds_host, req.body.ds_port);
                try {
                    parliament_Client.query(req.body.query_intern, function (error, result) {
                        if(error) {
                            console.log(error);
                            res.status(400).send(error);
                        } else {
                            //Check if valid json
                            result;
                            res.status(200).send(true);
                        }
                    });
                } catch (e) {
                    res.status(400).send(e);
                }     
    			break;
			case('POSTGRESQL'):
                res.status(400).send("Not yet supported");
    			break;
			default:
				console.log('ERROR CHECKING DATASET');
				console.log(req.body.ds_type);
    			break;

    	}
				
	}
};
