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
var Sparql_Client = require('../connectors/Sparql_Client.js');


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
                            query = "SELECT categories.category_name, sub_datasets.sd_name, sub_datasets.sd_description, main_datasets.md_name, main_datasets.md_description, datastores.ds_type, datastores.ds_host, datastores.ds_port, datastores.db_instance, datastores.db_user, datastores.db_password, datastores.db_instance "
                            query += "FROM public.sub_datasets INNER JOIN public.main_datasets ON sub_datasets.md_id=main_datasets.md_id INNER JOIN public.datastores ON main_datasets.ds_id=datastores.ds_id INNER JOIN categories_relationships ON categories_relationships.md_id=main_datasets.md_id INNER JOIN categories ON categories.category_id=categories_relationships.category_id "
                            words = req.params.category_name.split("&");
                            var index = 1;
                            var params = [];
                            for(i in words) {
                                word = words[i].split(",");
                                if(i==0) {
                                    for(j in word) {
                                        if(j==0) {
                                            tmp = "WHERE categories.category_name LIKE '%' || $"+index+" || '%' ";
                                            query += tmp;
                                            params.push(word[j]);
                                            index++;
                                            logCategory(client, word[j], accessToken);
                                        } else {
                                            tmp = "OR categories.category_name LIKE '%' || $"+index+" || '%' ";
                                            params.push(word[j]);
                                            index++;
                                            logCategory(client, word[j], accessToken);
                                        }
                                    }
                                } else {
                                    for(j in word) {
                                        if(j==0) {
                                            tmp = "AND categories.category_name LIKE '%' || $"+index+" || '%' ";
                                            query += tmp;
                                            params.push(word[j]);
                                            index++;
                                            logCategory(client, word[j], accessToken);
                                        } else {
                                            tmp = "OR categories.category_name LIKE '%' || $"+index+" || '%' ";
                                            query += tmp;
                                            params.push(word[j]);
                                            index++;
                                            logCategory(client, word[j], accessToken);
                                        }
                                    }
                                }
                            }
                            query += ";";
                            client.query(query, params, function(err, result) {
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
                                            // Prepare Connectors
                                            var Answer = {
                                                search_tag: req.params,
                                                results: [],
                                                data: {
                                                    Rest: {
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
                                                }
                                            }

                                            switch(result.rows[index].ds_type) {
                                                /** TODO:
                                                 * Need to get query from database, then execute
                                                 */
                                                case("POSTGRESQL"):
                                                    answerCount ++;
                                                    // PostgreSQL
                                                    _url = "postgres://" + result.rows[index].db_user + ":" + result.rows[index].db_password + "@" + result.rows[index].db_host + ":" + result.rows[index].db_port + "/" + result.rows[index].db_instance;
                                                    var postgres_Client = new Postgres_Client(url);
                                                    postgres_Client.setURL(url);
                                                    /*postgres_Client.query(result.rows[index].query_intern, [], function(_result, err) {
                                                        if(err) {
                                                            //console.log(err);
                                                            finish(res, Answers, answerCount, result.rows.length);
                                                        } else {
                                                            Result = {
                                                                preview: _result.parseRowsByColNames("Datasets").Datasets,
                                                                query: result.rows[index].query_intern,
                                                                query_description: result.rows[index].query_description,
                                                                sd_name: result.rows[index].sd_name,
                                                                sd_description: result.rows[index].sd_description,
                                                                md_name: result.rows[index].md_name,
                                                                md_description: result.rows[index].md_description
                                                            }
                                                            Answer.data.postgres.push(Result);
                                                            finish(res, Answer, answerCount, result.rows.length);
                                                        }
                                                    });*/
                                                    finish(res, Answer, answerCount, result.rows.length);
                                                    break;
                                                case("REST"):
                                                    answerCount ++;
                                                    request(result.rows[index].ds_host, function(error, response, body) {
                                                        if(!error) {
                                                            dt = {
                                                                name: result.rows[index].sd_name,
                                                                descritpion: result.rows[index].sd_descripton,
                                                                preview: JSON.parse(body)
                                                            }
                                                            Answer.data.Rest.data.push(dt);
                                                            Answer.data.Rest.count ++;
                                                            finish(res, Answer, answerCount, result.rows.length);
                                                        } else {
                                                            console.log(error);
                                                            console.log(response);
                                                        }
                                                    });
                                                    break;
                                                case("COUCHDB"):
                                                    answerCount ++;
                                                    var data = result.rows[index];
                                                    var length = result.rows.length;
                                                    var couchdb_Client = new CouchDB_Client(data.ds_host, data.ds_port);
                                                    couchdb_Client.useDatabase(data.db_instance);
                                                    couchdb_Client.query(function (result) {
                                                        Answer.data.couchDB.data.push(result);
                                                        Answer.data.couchDB.count ++;
                                                        finish(res, Answer, answerCount, length);
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
                                    /*// EnviroCar
                                    var enviroCar_Client = new EnviroCar_Client();
                                    enviroCar_Client.query("sensors", function(data) {
                                        Answer.enviroCar.time = (Date.now() - time) / 1000 + " s";
                                        Answer.enviroCar.data = data.results;
                                        answerCount += 1;
                                        finish(res, Answer, answerCount, 1);
                                    });

                                    

                                    // Parliament
                                    var sparql_Client = new Sparql_Client();
                                    sparql_Client.query("SELECT ?p ?o { <http://vocab.lodcom.de/muenster> ?p ?o }", function(result) {
                                        Answer.parliament.time = (Date.now() - time) / 1000 + " s";
                                        Answer.parliament.data = result;
                                        answerCount += 1;
                                        finish(res, Answer, answerCount, 1);
                                    });

                                    // CouchDB
                                    var couchDB_Client = new CouchDB_Client();
                                    couchDB_Client.query(function (result) {
                                        Answer.couchDB.time = (Date.now()-time) / 1000 + " s";
                                        Answer.couchDB.data = result;
                                        answerCount += 1;
                                        finish(res, Answer, answerCount, 1);
                                    });*/

                            });
                        }
                    }
                });
            }
        });
    }
};


/**
 * Check
 * @param  {number} count
 * @param  {number} maximum
 * @return {boolean} true or false
 */
var check = function (count, max) {
    if(count == max) {
        return true;
    } else {
        return false;
    }
};


/**
 * Finish
 */
var finish = function (res, Answer, answerCount, max) {
    if(check(answerCount, max)) {
        res.status(201).send(Answer);
    }
};

var logCategory = function (client, category_name, accessToken) {
    console.log(category_name);
    client.query("SELECT category_id FROM categories WHERE category_name LIKE '%' || $1 || '%' ", [
        category_name
    ], function (err, result) {
        if(err) {
            console.log(err);
        } else {
            if(result.rows.length == 0) {
                console.log("No Category");
            } else {
                console.log(result.rows[0].category_id);
                category_id = result.rows[0].category_id;
                client.query("INSERT INTO Logs VALUES ($1, now(), $2)", [accessToken, category_id], function (err, result) {
                    if(err) {
                        console.log(err);
                    } else {
                        //Logged the search
                    }
                });
            }
        }
    });
}
