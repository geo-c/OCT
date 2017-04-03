var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');

var path = require('path');
var fs = require('fs');
var mustache = require('mustache');

var async = require('async');


exports.request = function(req, res) {
/*
    var app = {
        app_name: '',
        app_id: '',
        app_desc: '',
        usages_dataset: [],
        usages_category: []
    };

    var dataset = {
        dataset_id: '',
        dataset_name: '',
        dataset_desc: ''
    };

    var category = {
        category_id: '',
        category_name: ''
    }

    var usage_dataset = {
        usage_id: '',
        dataset_id: '',
        calls: ''
    };

    var usage_category = {
        usage_id: '',
        category_id: '',
        calls: ''
    };*/

    var json = {
        apps: [],
        categories : [],
        datasets: []
    }

    var queryStr = 'SELECT apps.app_hash AS app_id, apps.app_name, apps.app_description AS app_desc FROM public.apps;';
    var params = [];

    client.query(queryStr, params, function (err, result_app) {
        if(err) {
            //res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            res.status(404).send(_.extend(errors.database.error_2, err));
        } else {

            var queryStr = 'SELECT * FROM categories';
            var params = [];

            client.query(queryStr, params, function (err, result_category) {
                if(err) {
                    es.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                    return console.error(errors.database.error_2.message, err);
                } else {
                    queryStr = 'SELECT queries.query_extern AS dataset_name, sub_datasets.sd_id AS dataset_id, sub_datasets.sd_description AS dataset_desc FROM queries INNER JOIN sub_datasets ON sub_datasets.sd_id = queries.sd_id;';
                    params = [];

                    client.query(queryStr, params, function (err, result_dataset) {
                        if(err) {
                            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                            return console.error(errors.database.error_2.message, err);
                        } else {
                            async.eachSeries(result_app, function (_app, callback) {
                                app = {
                                    app_name: _app.app_name,
                                    app_id: _app.app_id.substr(94,8).replace(".",""),
                                    app_desc: _app.app_desc,
                                    usages_dataset: [],
                                    usages_category: []
                                };

                                queryStr = 'SELECT count(logs.category_id) AS calls, logs.category_id FROM logs WHERE logs.app_hash=$1 AND logs.category_id IS NOT NULL GROUP BY logs.category_id ORDER BY calls DESC;';
                                params = [_app.app_id];

                                client.query(queryStr, params, function (err, result_usages_category) {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        async.eachSeries(result_usages_category, function (_usage_category, _callback) {
                                            usage_category = {
                                                usage_id: 'c'+_usage_category.category_id+'_'+_app.app_id.substr(94,8),
                                                category_id: _usage_category.category_id,
                                                calls: _usage_category.calls
                                            }

                                            app.usages_category.push(usage_category);

                                            _callback();

                                        }, function (err) {
                                            if(err) {
                                                console.log(err);
                                            } else {
                                                //GET Datasets used by app
                                                queryStr = 'SELECT count(logs.sd_id) AS calls, logs.sd_id AS dataset_id FROM logs WHERE logs.app_hash=$1 AND logs.sd_id IS NOT NULL GROUP BY logs.sd_id ORDER BY calls DESC;';
                                                params = [_app.app_id];

                                                client.query(queryStr, params, function (err, result_usage_dataset) {
                                                    if(err) {
                                                        res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                                        return console.error(errors.database.error_2.message, err);
                                                    } else {
                                                        async.eachSeries(result_usage_dataset, function (_usage_dataset, _callback) {
                                                            usage_dataset = {
                                                                usage_id: 'd'+_usage_dataset.dataset_id+'_'+_app.app_id.substr(94,8),
                                                                dataset_id: _usage_dataset.dataset_id,
                                                                calls: _usage_dataset.calls
                                                            }
                                                            if(result_usage_dataset.indexOf(_usage_dataset) < result_usage_dataset.length-1) {
                                                                usage_dataset.nlast = true;
                                                            }

                                                            app.usages_dataset.push(usage_dataset);

                                                            _callback();

                                                        }, function (err) {
                                                            if(err) {
                                                                console.log(err);
                                                            } else {
                                                                json.apps.push(app)
                                                                callback();
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }, function (err) {
                                if(err) {
                                    console.log(err);
                                }
                                else {

                                    async.eachSeries(result_category, function (_category, callback) {

                                        category = {
                                            category_id : _category.category_id,
                                            category_name: _category.category_name
                                        }

                                        json.categories.push(category);

                                        callback();

                                    }, function (err) {
                                        if(err) {
                                            console.log(err);
                                        } else {

                                            async.eachSeries(result_dataset, function (_dataset, callback) {


                                                dataset = {
                                                    dataset_id: _dataset.dataset_id,
                                                    dataset_name: _dataset.dataset_name,
                                                    dataset_desc: _dataset.dataset_desc,
                                                    categories: []
                                                }


                                                queryStr = 'SELECT category_id FROM categories_relationships WHERE md_id = $1';
                                                params = [_dataset.dataset_id];

                                                client.query(queryStr, params, function (err, result_hasCategory) { 
                                                    if(err) {
                                                        console.log(err);
                                                    } else {

                                                        async.eachSeries(result_hasCategory, function (_category, _callback) {
                                                            if(result_hasCategory.indexOf(_category) < result_hasCategory.length-1) {
                                                                _category.nlast = true;
                                                            }
                                                            dataset.hasCategory = true;
                                                            dataset.categories.push(_category);

                                                            _callback();

                                                        }, function (err) {
                                                            if(err) {
                                                                console.log(err);
                                                            } else {
                                                                json.datasets.push(dataset);
                                                                callback();
                                                            }
                                                        });
                                                    }
                                                });

                                            }, function (err) {
                                                if(err) {
                                                    console.log(err);
                                                } else {
                                                    fs.readFile(path.join(__dirname, '../../templates/rdf'), function(err, data) {
                                                        if (err) throw err;

                                                        var template = data.toString();
                                                        var rdf = mustache.render(template, json);

                                                        if(req.query.format == "json") {
                                                            res.status(200).send(json);
                                                        } else if (req.query.format =="rdf") {
                                                            res.writeHead(200, {'Content-Type': 'application/force-download','Content-disposition':'attachment; filename=oct_statistics.rdf'});
                                                            res.end( rdf );

                                                            //res.status(200).send(rdf);
                                                        } else {
                                                            res.status(400).send("Please choose between json and rdf");
                                                        }
                                                    });                                    
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
