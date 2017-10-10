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
        // Database Query
        client.query('SELECT * FROM Apps WHERE app_hash=$1;', [
            accessToken
        ], function(err, result) {
            if (err) {
                res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                return console.error(errors.database.error_2.message, err);
            } else {

                // Check if App exists
                if (result.length === 0) {
                    res.status(errors.query.error_1.code).send(errors.query.error_1);
                    console.error(errors.query.error_1.message);
                } else {  
                    query = 'SELECT queries.query_id, queries.query_extern, queries.query_intern, queries.query_description, categories.category_name, endpoints.endpoint_host, endpoints.endpoint_port, endpoints.endpoint_path, datastores.ds_type, datastores.ds_host, datastores.ds_port, datastores.db_instance '
                    query += 'FROM main_datasets INNER JOIN sub_datasets ON main_datasets.md_id = sub_datasets.md_id INNER JOIN queries ON sub_datasets.sd_id = queries.sd_id INNER JOIN endpoints ON main_datasets.endpoint_id = endpoints.endpoint_id INNER JOIN datastores ON main_datasets.ds_id = datastores.ds_id INNER JOIN admins ON main_datasets.created_by = admins.username INNER JOIN categories_relationships On categories_relationships.md_id = main_datasets.md_id INNER JOIN categories ON categories_relationships.category_id = categories.category_id '

                    words = req.params.category_name.split("&");
                    var index = 1;
                    var params = [];
                    for(i in words) {
                        word = words[i].split(",");
                        if(i==0) {
                            for(j in word) {
                                console.log(word[j]);
                                if(j==0) {
                                    tmp = "WHERE categories.category_name LIKE '%' || $"+index+" || '%' ";
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
                    query += "AND queries.active='true';";
                    console.log(query);
                    client.query(query, params, function(err, result) {
                        if(err) {
                            console.log(err);
                        } else {
                            if(result.length === 0) {
                                console.log("No entry for this category");
                                res.status(errors.query.error_3.code).send(errors.query.error_3);
                            } else {
                                //res.status(201).send(result);
                                var answerCount = 1;
                                for(index in result) {
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
                                            },
                                            Parliament: {
                                                time: 0,
                                                count: 0,
                                                data: []
                                            }
                                        }
                                    }
                                    switch(result[index].ds_type) {
                                        /** TODO:
                                         * Need to get query from database, then execute
                                         */
                                        case("POSTGRESQL"):
                                            answerCount ++;
                                            // PostgreSQL
                                            _url = "postgres://" + result.rows[index].db_user + ":" + result.rows[index].db_password + "@" + result.rows[index].db_host + ":" + result.rows[index].db_port + "/" + result.rows[index].db_instance;
                                            var postgres_Client = new Postgres_Client(url);
                                            postgres_Client.setURL(url);
                                            /*postgres_Client.query(result[index].query_intern, [], function(_result, err) {
                                                if(err) {
                                                    //console.log(err);
                                                    finish(res, Answers, answerCount, result.length);
                                                } else {
                                                    Result = {
                                                        preview: _result.parseRowsByColNames("Datasets").Datasets,
                                                        query: result[index].query_intern,
                                                        query_description: result[index].query_description,
                                                        sd_name: result[index].sd_name,
                                                        sd_description: result[index].sd_description,
                                                        md_name: result[index].md_name,
                                                        md_description: result[index].md_description
                                                    }
                                                    Answer.data.postgres.push(Result);
                                                    finish(res, Answer, answerCount, result.length);
                                                }
                                            });*/
                                            finish(res, Answer, answerCount, result.length);
                                            break;
                                        case("REST"):
                                            var name = result[index].sd_name;
                                            var description = result[index].sd_description;
                                            console.log(result[index]);
                                            _url = result[index].ds_host;
                                            if(result[index].ds_port != null && result[index].ds_port != "") {
                                                console.log(ds_port);
                                                _url += ":" + result[index].ds_port + "/";
                                            }
                                            _url += result[index].query_intern;
                                            request(_url, function(error, response, body) {
                                                if(!error) {
                                                    dt = {
                                                        name: name,
                                                        descritpion: description,
                                                        preview: JSON.parse(body)
                                                    }
                                                    Answer.data.Rest.data.push(dt);
                                                    Answer.data.Rest.count ++;
                                                    Answer.data.Rest.time = (Date.now()-time) / 1000 + " s";
                                                    answerCount ++;
                                                    finish(res, Answer, answerCount, result.length);
                                                } else {
                                                    console.log(error);
                                                    console.log(response);
                                                    answerCount ++;
                                                    finish(res, Answer, answerCount, result.length);
                                                }
                                            });
                                            break;
                                        case("COUCHDB"):
                                            var length = result.length;
                                            var name = result[index].sd_name;
                                            var description = result[index].sd_description;

                                            var couchdb_Client = new CouchDB_Client(result[index].ds_host, result[index].ds_port);
                                            couchdb_Client.useDatabase(result[index].db_instance);
                                            couchdb_Client.query(result[index].query_intern, function (error, result) {
                                                if(error) {
                                                    console.log(error);
                                                } else {
                                                    dt = {
                                                        name: name,
                                                        description: description,
                                                        preview: result
                                                    }
                                                    Answer.data.couchDB.data.push(dt);
                                                    Answer.data.couchDB.count ++;
                                                    Answer.data.couchDB.time = (Date.now()-time) / 1000 + " s";
                                                }
                                                answerCount ++;
                                                finish(res, Answer, answerCount, length);
                                            });
                                            break;
                                        case("PARLIAMENT"):
                                            var length = result.length;
                                            parliament_Client = new Parliament_Client(result[index].ds_host, result[index].ds_port);
                                            parliament_Client.query(result[index].query_intern, function (error, result) {
                                                if(error) {
                                                    console.log(error);
                                                    answerCount ++;
                                                    finish(res, Answer, answerCount, length)
                                                } else {
                                                    Answer.data.Parliament.data.push(result);
                                                    Answer.data.Parliament.count ++;
                                                    Answer.data.Parliament.time = (Date.now()-time) / 1000 + " s";
                                                    answerCount ++;
                                                    finish(res, Answer, answerCount, length)
                                                }
                                            });
                                            break;
                                        default:
                                            answerCount++;
                                            console.log("unknown Database");
                                            console.log(result.rows[index].ds_type);
                                            finish(res, Answer, answerCount, result.length);
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
    console.log(answerCount);
    console.log(max)
    if(check(answerCount, max)) {
        res.status(201).send(Answer);
    }
};

var logCategory = function (client, category_name, accessToken) {
    client.query("SELECT category_id FROM categories WHERE category_name LIKE '%' || $1 || '%' ", [
        category_name
    ], function (err, result) {
        if(err) {
            console.log(err);
        } else {
            if(result.length == 0) {
                console.log("No Category");
            } else {
                console.log(result[0].category_id);
                category_id = result[0].category_id;
                client.query("INSERT INTO Logs(app_hash, timestamp, category_id, sd_id) VALUES ($1, now(), $2, null)", [accessToken, category_id], function (err, result) {
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
