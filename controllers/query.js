var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../config/secret');
var db_settings = require('../server.js').db_settings;
var errors = require('./../config/errors');

var Ajv = require('ajv');
var schema = require('./../models/query');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);

var CouchDB_Client = require('../controllers/connectors/CouchDB_Client.js');
var EnviroCar_Client = require('../controllers/connectors/EnviroCar_Client.js');
var Postgres_Client = require('../controllers/connectors/Postgres_Client.js');
var Sparql_Client = require('../controllers/connectors/Sparql_Client.js');


// POST
exports.request = function(req, res){
    var time = Date.now();
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
                var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

                pg.connect(url, function(err, client, done) {
                    if (err) {
                        res.status(errors.database.error_1.code).send(errors.database.error_1);
                        return console.error(errors.database.error_1.message, err);
                    } else {
                        // Database Query
                        client.query('SELECT * FROM Apps WHERE app_name=$1;', [
                            decoded.app_name
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

                                    // Prepare result
                                    var app = result.rows[0];
                                    client.query('INSERT INTO Logs VALUES($1, now());', [
                                        decoded.app_name
                                    ], function(err, result) {
                                        /* if (err) {
                                            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                            return console.error(errors.database.error_2.message, err);
                                        }*/
                                    });



                                    var Answer = {
                                        enviroCar: {
                                            time: 0,
                                            count: 0,
                                            data: []
                                        },
                                        postgres: {
                                            time: 0,
                                            count: 0,
                                            data: []
                                        },
                                        parliament: {
                                            time: 0,
                                            count: 0,
                                            data: []
                                        },
                                        couchDB: {
                                            time: 0,
                                            count: 0,
                                            data: []
                                        }
                                    };
                                    var answerCount = 0;
                                    //Envirocar
                                    var enviroCar_Client = new EnviroCar_Client;
                                    enviroCar_Client.query("sensors", function(data) {
                                        Answer.enviroCar.time = (Date.now() - time) / 1000 + " s";
                                        Answer.enviroCar.data = data.results;
                                        answerCount += 1;
                                        finish(res, Answer, answerCount, 1);
                                    });
                                    //postgres
                                    var postgres_Client = new Postgres_Client(url);
                                    //postgres_Client.setURL(url);
                                    postgres_Client.query('SELECT logs."timestamp", logs.app_name FROM public.logs;', [], function(result) {
                                        Answer.postgres.time = (Date.now() - time) / 1000 + " s";
                                        Answer.postgres.data = result.parseRowsByColNames("Datasets").Datasets;
                                        answerCount += 1;
                                        finish(res, Answer, answerCount, 1);
                                    });
                                    //parliament
                                    var sparql_Client = new Sparql_Client;
                                    sparql_Client.query("SELECT ?p ?o { <http://vocab.lodcom.de/muenster> ?p ?o }", function(result) {
                                        Answer.parliament.time = (Date.now() - time) / 1000 + " s";
                                        Answer.parliament.data = result;
                                        answerCount += 1;
                                        finish(res, Answer, answerCount, 1);
                                    });
                                    //CouchDB
                                    var couchDB_Client = new CouchDB_Client;
                                    couchDB_Client.query(function (result) {
                                        Answer.couchDB.time = (Date.now()-time) / 1000 + " s";
                                        Answer.couchDB.data = result;
                                        answerCount += 1;
                                        finish(res, Answer, answerCount, 1);
                                    });
                                }
                            }
                        });
                    }
                });

                // TODO:
                // - Find app_name in Apps-Table
                // - Log app_name in Logs-Table
                // - Find results for query
            }

        });
    }
};

var check = function (count, max) {
    max = max*4
    if(count == max) {
        return true;
    } else {
        return false;
    }
};

var finish = function (res, Answer, answerCount, max) {
    if(check(answerCount, max)) {
        Answer.enviroCar.count = Answer.enviroCar.data.length;
        Answer.parliament.count = Answer.parliament.data.length;
        Answer.postgres.count = Answer.postgres.data.length;
        Answer.couchDB.count = Answer.couchDB.data.length;
        res.status(201).send(Answer);
    }
};
