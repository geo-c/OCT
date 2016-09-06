var db_settings = require('../../server.js').db_settings;
var pg = require('pg');
var _ = require('underscore');
var request = require('request');

var errors = require('./../../config/errors');
var WKT = require("./WKT.js");

var CouchDB_Client = require('../connectors/CouchDB_Client.js');

exports.request = function(req, res) {
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(errors.database.error_1.code).send(errors.database.error_1);
            return console.error(errors.database.error_1.message, err);
        } else {

            // Database Query
            client.query('SELECT ds_type, ds_host, ds_port, db_instance, db_user, db_password FROM Datastores INNER JOIN main_datasets ON Datastores.ds_id = main_datasets.ds_id WHERE md_id=$1;',[
            	req.params.md_id
        	], function(err, result) {
                done();

                if (err) {
                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                    return console.error(errors.database.error_2.message, err);
                } else {
                    if(result.rows.length != 0) {
                    	var wkt = new WKT();
                    	switch(result.rows[0].ds_type) {
                    		case("REST"):
                    			request(result.rows[0].ds_host, function(error, response, body) {
                                    if(!error) {
                                        var json = JSON.parse(body);
                                        var counter = 0;
                                        wkt.convert(json);
                                        _wkt = wkt.get();
	                                    for(i in _wkt) {
	                                    	client.query("SELECT * FROM spatial_information WHERE md_id=$1 AND geometry=ST_GeomFromText($2, 4326);", [
	                                    		req.params.md_id,
	                                    		_wkt[i]
	                                		], function (err, result) {
	                                			if(!err) {
	                                				if(result.rows.length == 0) {
	                                					client.query("INSERT INTO spatial_information(created, updated,md_id, geometry) VALUES(now(), now(),$1, ST_GeomFromText($2, 4326));", [
					                                    	req.params.md_id,
					                                    	_wkt[i]
					                                    ], function (err, result) {
				                                    		if(!err) {
				                                    			counter ++;
				                                    			console.log(result);
				                                    		}
					                                    });
	                                				}
	                                			}
	                                		});
	                                    }
	                                    res.status(200).send({message: "Added " + counter + " new spatial entries."});
                                    } else {
                                        console.log(error);
                                        console.log(response);
                                    }
                                });
                    			break;
                    		case("COUCHDB"):
                    			var couchdb_Client = new CouchDB_Client(result.rows[0].ds_host, result.rows[0].ds_port);
                    			couchdb_Client.useDatabase(result.rows[0].db_instance);
                    			var counter = 0;
                                couchdb_Client.query(function (json) {
                                	wkt.convert(json);
                                	_wkt = wkt.get();
                                    for(i in _wkt) {
                                    	client.query("SELECT * FROM spatial_information WHERE md_id=$1 AND geometry=ST_GeomFromText($2, 4326);", [
                                    		req.params.md_id,
                                    		_wkt[i]
                                		], function (err, result) {
                                			if(!err) {
                                				if(result.rows.length == 0) {
                                					client.query("INSERT INTO spatial_information(created, updated,md_id, geometry) VALUES(now(), now(),$1, ST_GeomFromText($2, 4326));", [
				                                    	req.params.md_id,
				                                    	_wkt[i]
				                                    ], function (err, result) {
			                                    		if(!err) {
			                                    			counter ++;
			                                    			console.log(result);
			                                    		}
				                                    });
                                				}
                                			}
                                		});
                                    }
                                    res.status(200).send({message: "Added " + counter + " new spatial entries."});
                                });
                    			break;
                    		default:
                    			break;
                    	}
                    }
                }
            });
        }
    });
};