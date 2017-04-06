var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


var request = require('request');
var jwt = require('jsonwebtoken');
var secret = require('../../config/secret');

var Ajv = require('ajv');
var schema = require('../../models/query');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);

var CouchDB_Client = require('../connectors/CouchDB_Client.js');
var EnviroCar_Client = require('../connectors/EnviroCar_Client.js');
var Postgres_Client = require('../connectors/Postgres_Client.js');
var Parliament_Client = require('../connectors/Parliament_Client.js');


// POST
exports.request = function(req, res){
    // Create timestamp
    var time = Date.now();
    // Check if Header contains Access-Token
    var accessToken = "";
    Flag = true;
    if(!req.query.authorization || req.query.authorization === "") {
        if(!req.headers.authorization || req.headers.authorization === ""){
            console.log("error. no valid authorization");
            Flag = false;
        } else {
            accessToken = req.headers.authorization;
            Flag = true;
        }
    } else {
        accessToken = req.query.authorization;
        Flag = true;
    }
    if(!Flag){
       res.status(errors.authentication.error_2.code).send(errors.authentication.error_2);
       return console.error(errors.authentication.error_2.message); 
    } else {

        var queryStr = 'SELECT * FROM Apps WHERE app_hash=$1;';
        var params = [accessToken];

        client.query(queryStr, params, function (err, result) {
            if(err) {
                //res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                res.status(404).send(_.extend(errors.database.error_2, err));
            } else {
                if (result.length === 0) {
                    res.status(errors.query.error_1.code).send(errors.query.error_1);
                    console.error(errors.query.error_1.message);
                } else {

                    var queryStr = "SELECT sub_datasets.sd_name, sub_datasets.sd_id, sub_datasets.sd_description, main_datasets.md_name, main_datasets.md_description, datastores.ds_type, datastores.ds_host, datastores.ds_port, datastores.db_instance, datastores.db_user, datastores.db_password, datastores.db_instance, queries.query_intern, queries.query_extern, queries.query_description "
                    queryStr += "FROM sub_datasets INNER JOIN queries ON sub_datasets.sd_id = queries.sd_id INNER JOIN public.main_datasets ON sub_datasets.md_id=main_datasets.md_id INNER JOIN public.datastores ON main_datasets.ds_id=datastores.ds_id "
                    queryStr += "WHERE queries.query_extern = $1 AND queries.active = 'true';"
                    var params = [req.params.query_extern];

                    client.query(queryStr, params, function (err, result) {
                        if(err) {
                            //res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                            res.status(404).send(_.extend(errors.database.error_2, err));
                        } else {
                            if(result.length === 0) {
                                console.log("No entry for this category");
                                res.status(errors.query.error_3.code).send(errors.query.error_3);
                            } else {
                                var userIp = req.headers['x-forwarded-for'] || 
                                     req.connection.remoteAddress || 
                                     req.socket.remoteAddress ||
                                     req.connection.socket.remoteAddress;

                                var ip = userIp.split(':')[3];

                                request('http://freegeoip.net/json/' + ip, function (error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        var user_data = JSON.parse(body);
                                        logDataset(client, accessToken, result[0].sd_id, user_data);
                                    }
                                });
                                // Prepare Connectors
                                switch(result[0].ds_type) {
                                    /** TODO:
                                     * Need to get query from database, then execute
                                     */
                                    case("POSTGRESQL"):
                                        // PostgreSQL
                                        _url = "postgres://" + result[0].db_user + ":" + result[0].db_password + "@" + result[0].db_host + ":" + result[0].db_port + "/" + result[0].db_instance;
                                        var postgres_Client = new Postgres_Client(_url);
                                        postgres_Client.setURL(url);
                                        postgres_Client.query(result[0].query_intern, [], function(_result, err) {
                                            if(err) {
                                                res.status(400).send(err);
                                            } else {
                                                console.log(_result);
                                                res.status(200).send(_result);
                                            }
                                        });
                                        break;
                                    case("REST"):
                                        var name = result[0].sd_name;
                                        var description = result[0].sd_description;
                                        request(result[0].ds_host+result[0].query_intern, function(error, response, body) {
                                            if(error) {
                                                res.status(400).send(error);
                                            } else {
                                                res.status(200).send(JSON.parse(body));
                                            }
                                        });
                                        break;
                                    case("COUCHDB"):
                                        var couchdb_Client = new CouchDB_Client(result[0].ds_host, result[0].ds_port);
                                        couchdb_Client.useDatabase(result[0].db_instance);
                                        couchdb_Client.query(result[0].query_intern, function (error, result) {
                                            if(error) {
                                                res.status(400).send(error);
                                            } else {
                                                res.status(200).send(result);
                                            }
                                        });
                                        break;
                                    case("PARLIAMENT"):
                                        console.log("Parliament")
                                        var length = result.length;
                                        parliament_Client = new Parliament_Client(result[0].ds_host, result[0].ds_port);
                                        parliament_Client.query(result[0].query_intern, function (error, result) {
                                            if(error) {
                                                console.log("error")
                                                console.log(error);
                                                res.status(400).send(error);
                                            } else {
                                                console.log("result");
                                                res.status(200).send(result);
                                            }
                                        });
                                        break;
                                    default:
                                        console.log("unknown Database");
                                        console.log(result[0].ds_type);
                                        break;
                                }
                            }
                        }
                    });
                }
            }
        });

    }
};


var logDataset = function (client, accessToken, sd_id, user_data) {
    if(user_data != null) {
        queryStr = 'INSERT INTO visitors (date, city, country_code, country_name, latitude, longitude, metro_code, region_code, region_name, time_zone, zip_code) VALUES (now(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id AS location_id';


         params = [
            user_data.city,
            user_data.country_code,
            user_data.country_name,
            user_data.latitude,
            user_data.longitude,
            user_data.metro_code,
            user_data.region_code,
            user_data.region_name,
            user_data.time_zone,
            user_data.zip_code
        ];

        client.query(queryStr, params, function (err, result) {
            if(err) {
                console.log(err);
            } else {
                var queryStr = 'INSERT INTO Logs(app_hash, timestamp, category_id, sd_id, location_id) VALUES ($1, now(), null, $2, $3);';
                var params = [
                    accessToken, 
                    sd_id,
                    result[0].location_id
                ];

                client.query(queryStr, params, function (err, result) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("OK");
                    }
                });
            }
        });
    }
}
