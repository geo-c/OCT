var pg = require('pg');
var _ = require('underscore');
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
    if(!req.headers.authorization || req.headers.authorization === ""){
        res.status(errors.authentication.error_2.code).send(errors.authentication.error_2);
        return console.error(errors.authentication.error_2.message);
    } else {
        var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;
        accessToken = req.headers.authorization;

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

                            // Prepare Result
                            var app = result.rows[0];
                            
                            //Find ID from category
                            client.query("SELECT category_id FROM categories WHERE catgegory_name LIKE '%' || $1 || '%'", [
                            req.params.category_name
                            ], function(err, result) {
                                if (err) {
                                    console.log(err);
                                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                    return console.error(errors.database.error_2.message, err);
                                } else {
                                    console.log(result.rows);
                                }
                            });

                            // Logging
                            client.query('INSERT INTO Logs VALUES($1, now(), NULL, $2);', [
                                accessToken,
                                1
                            ], function(err, result) {
                                if (err) {
                                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                    return console.error(errors.database.error_2.message, err);
                                } else {
                                    query = "SELECT categories.catgegory_name, queries.query_intern, queries.query_extern, queries.query_description, sub_datasets.sd_name, sub_datasets.sd_description, main_datasets.md_name, main_datasets.md_description, datastores.ds_type, datastores.ds_host, datastores.ds_port, datastores.db_instance, datastores.db_user, datastores.db_password, datastores.db_instance "
                                    query += "FROM public.sub_datasets INNER JOIN public.queries ON sub_datasets.sd_id=queries.sd_id INNER JOIN public.main_datasets ON sub_datasets.md_id=main_datasets.md_id INNER JOIN public.datastores ON main_datasets.ds_id=datastores.ds_id INNER JOIN categories_relationships ON categories_relationships.md_id=main_datasets.md_id INNER JOIN categories ON categories.category_id=categories_relationships.category_id "
                                    words = req.params.category_name.split("&");
                                    var index = 1;
                                    var params = [];
                                    for(i in words) {
                                        word = words[i].split(",");
                                        if(i==0) {
                                            for(j in word) {
                                                if(j==0) {
                                                    tmp = "WHERE categories.catgegory_name LIKE '%' || $"+index+" || '%' ";
                                                    query += tmp;
                                                    console.log(tmp);
                                                    params.push(word[j]);
                                                    index++;
                                                } else {
                                                    tmp = "OR categories.catgegory_name LIKE '%' || $"+index+" || '%' ";
                                                    query += tmp;
                                                    console.log(tmp);
                                                    params.push(word[j]);
                                                    index++;
                                                }
                                            }
                                        } else {
                                            for(j in word) {
                                                if(j==0) {
                                                    tmp = "AND categories.catgegory_name LIKE '%' || $"+index+" || '%' ";
                                                    query += tmp;
                                                    console.log(tmp);
                                                    params.push(word[j]);
                                                    index++;
                                                } else {
                                                    tmp = "OR categories.catgegory_name LIKE '%' || $"+index+" || '%' ";
                                                    query += tmp;
                                                    console.log(tmp);
                                                    params.push(word[j]);
                                                    index++;
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
                                                res.status(201).send(result.rows);
                                                var Answers = {
                                                    searched_Tag: req.params ,
                                                    results: []
                                                };
                                                var answerCount = 0;
                                                for(index in result.rows) {
                                                    console.log(result.rows[index]);
                                                    // Prepare Connectors
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

                                                    switch(result.rows[index].ds_type) {
                                                        case("POSTGRESQL"):
                                                            // PostgreSQL
                                                            _url = "postgres://" + result.rows[index].db_user + ":" + result.rows[index].db_password + "@" + result.rows[index].db_host + ":" + result.rows[index].db_port + "/" + result.rows[index].db_instance;
                                                            var postgres_Client = new Postgres_Client(url);
                                                            // postgres_Client.setURL(url);
                                                            /*postgres_Client.query(result.rows[index].query_intern, [], function(_result, err) {
                                                                if(err) {
                                                                    //console.log(err);
                                                                    answerCount += 1;
                                                                    finish(res, Answers, answerCount, result.rows.length+1);
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
                                                                    Answers.results.push(Result);
                                                                    answerCount += 1;
                                                                    finish(res, Answers, answerCount, result.rows.length+1);
                                                                }
                                                            });*/
                                                            break;

                                                        default:
                                                            console.log("unknown Database");
                                                            break;
                                                    }
                                                }
                                            }
                                        }
                                    });
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

                                }
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
var finish = function (res, Answers, answerCount, max) {
    console.log(answerCount);
    console.log(max);
    if(check(answerCount, max)) {
        res.status(201).send(Answers);
    }
};
