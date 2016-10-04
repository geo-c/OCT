var pg = require('pg');
var _ = require('underscore');
var request = require('request');
var jwt = require('jsonwebtoken');
var secret = require('../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('../../config/errors');

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
        var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

        // Connect to Database
        pg.connect(url, function(err, client, done) {
            if (err) {
                res.status(errors.database.error_1.code).send(errors.database.error_1);
                return console.error(errors.database.error_1.message, err);
            } else {

                // Database Query
                client.query('SELECT * FROM Apps WHERE app_hash=$1;', [
                    accessToken
                ], function(err, result) {
                    done();

                    if (err) {
                        res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                        return console.error(errors.database.error_2.message, err);
                    } else {

                        // Check if App exists
                        if (result.rows.length === 0) {
                            res.status(errors.query.error_1.code).send(errors.query.error_1);
                            console.error(errors.query.error_1.message);
                        } else {
                            query = "SELECT sub_datasets.sd_name, sub_datasets.sd_id, sub_datasets.sd_description, main_datasets.md_name, main_datasets.md_description, datastores.ds_type, datastores.ds_host, datastores.ds_port, datastores.db_instance, datastores.db_user, datastores.db_password, datastores.db_instance, queries.query_intern, queries.query_extern, queries.query_description "
                            query += "FROM sub_datasets INNER JOIN queries ON sub_datasets.sd_id = queries.sd_id INNER JOIN public.main_datasets ON sub_datasets.md_id=main_datasets.md_id INNER JOIN public.datastores ON main_datasets.ds_id=datastores.ds_id "
                            query += "WHERE queries.query_extern = $1"
                            client.query(query, [
                                req.params.query_extern
                            ], function(err, result) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    if(result.rows.length === 0) {
                                        console.log("No entry for this category");
                                        res.status(errors.query.error_3.code).send(errors.query.error_3);
                                    } else {
                                        //res.status(201).send(result.rows);
                                        var answerCount = 0;
                                        for(index in result.rows) {
                                            logDataset(client, accessToken, result.rows[index].sd_id);
                                            // Prepare Connectors
                                            switch(result.rows[index].ds_type) {
                                                /** TODO:
                                                 * Need to get query from database, then execute
                                                 */
                                                case("POSTGRESQL"):
                                                    answerCount ++;
                                                    // PostgreSQL
                                                    _url = "postgres://" + result.rows[index].db_user + ":" + result.rows[index].db_password + "@" + result.rows[index].db_host + ":" + result.rows[index].db_port + "/" + result.rows[index].db_instance;
                                                    var postgres_Client = new Postgres_Client(_url);
                                                    postgres_Client.setURL(url);
                                                    postgres_Client.query(result.rows[index].query_intern, [], function(_result, err) {
                                                        if(err) {
                                                            res.status(400).send(err);
                                                        } else {
                                                            res.status(200).send(_result);
                                                        }
                                                    });
                                                    break;
                                                case("REST"):
                                                    var name = result.rows[index].sd_name;
                                                    var description = result.rows[index].sd_description;
                                                    request(result.rows[index].ds_host+result.rows[index].query_intern, function(error, response, body) {
                                                        if(error) {
                                                            res.status(400).send(error);
                                                        } else {
                                                            res.status(200).send(JSON.parse(body));
                                                        }
                                                    });
                                                    break;
                                                case("COUCHDB"):
                                                    var couchdb_Client = new CouchDB_Client(result.rows[index].ds_host, result.rows[index].ds_port);
                                                    couchdb_Client.useDatabase(result.rows[index].db_instance);
                                                    couchdb_Client.query(result.rows[index].query_intern, function (error, result) {
                                                        if(error) {
                                                            res.status(400).send(error);
                                                        } else {
                                                            res.status(200).send(result);
                                                        }
                                                    });
                                                    break;
                                                case("PARLIAMENT"):
                                                    var length = result.rows.length;
                                                    parliament_Client = new Parliament_Client(result.rows[index].ds_host, result.rows[index].ds_port);
                                                    parliament_Client.query(result.rows[index].query_intern, function (error, result) {
                                                        if(error) {
                                                            res.status(400).send(error);
                                                        } else {
                                                            res.status(200).send(result);
                                                        }
                                                    });
                                                    break;
                                                default:
                                                    answerCount++;
                                                    console.log("unknown Database");
                                                    console.log(result.rows[index].ds_type);
                                                    finish(res, Answer, answerCount, result.rows.length);
                                                    break;
                                            }

                                        }
                                    }
                                }

                            });
                        }
                    }
                });
            }
        });
    }
};


var logDataset = function (client, accessToken, sd_id) {
    client.query("INSERT INTO Logs(app_hash, timestamp, category_id, sd_id) VALUES ($1, now(), null, $2)", [accessToken, sd_id], function (err, result) {
        if(err) {
            console.log(err);
        } else {
            //Logged the search
        }
    });
}
