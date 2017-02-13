var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');

var path = require('path');
var fs = require('fs');
var mustache = require('mustache');

var async = require('async');


exports.request = function(req, res) {

    var app = {
        app_name: '',
        app_id: '',
        app_desc: '',
        usages: []
    };

    var dataset = {
        dataset_id: '',
        dataset_name: '',
        dataset_desc: ''
    };

    var usage = {
        usage_id: '',
        dataset_id: '',
        calls: ''
    };

    var json = {
        apps: [],
        datasets: []
    }

    var queryStr = 'SELECT apps.app_hash AS app_id, apps.app_name, apps.app_description AS app_desc FROM public.apps;';
    var params = [];

    client.query(queryStr, params, function (err, result_app) {
        if(err) {
            //res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            res.status(404).send(_.extend(errors.database.error_2, err));
        } else {

            queryStr = 'SELECT queries.query_extern AS dataset_name, sub_datasets.sd_id AS dataset_id, sub_datasets.sd_description AS dataset_desc FROM queries INNER JOIN sub_datasets ON sub_datasets.sd_id = queries.sd_id;';
            params = [];

            client.query(queryStr, params, function (err, result_dataset) {
                if(err) {
                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                    return console.error(errors.database.error_2.message, err);
                } else {
                    async.eachSeries(result_app, function (_app, callback) {

                        //GET Datasets used by app
                        queryStr = 'SELECT count(logs.sd_id) AS calls, logs.sd_id AS dataset_id FROM logs WHERE logs.app_hash=$1 GROUP BY logs.sd_id ORDER BY calls DESC;';
                        params = [_app.app_id];

                        app = {
                            app_name: _app.app_name,
                            app_id: _app.app_id.substr(94,8),
                            app_desc: _app.app_desc,
                            usages: []
                        };

                        client.query(queryStr, params, function (err, result_usage) {
                            if(err) {
                                res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                return console.error(errors.database.error_2.message, err);
                            } else {

                                async.eachSeries(result_usage, function (_usage, _callback) {
                                    usage = {
                                        usage_id: _usage.dataset_id+'_'+ _app.app_id.substr(94,8),
                                        dataset_id: _usage.dataset_id,
                                        calls: _usage.calls
                                    }

                                    app.usages.push(usage);

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

                    }, function (err) {
                        if(err) {
                            console.log(err);
                        }
                        else {
                            async.eachSeries(result_dataset, function (_dataset, callback) {
                                dataset = {
                                    dataset_id: _dataset.dataset_id,
                                    dataset_name: _dataset.dataset_name,
                                    dataset_desc: _dataset.dataset_desc
                                }

                                json.datasets.push(dataset);

                                callback();

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


/*



    var queryStr = 'SELECT apps.app_hash AS app_id, apps.app_name, apps.app_description AS app_desc FROM public.apps;';
    var params = [];

    client.query(queryStr, params, function (err, result_app) {
        if(err) {
            //res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            res.status(404).send(_.extend(errors.database.error_2, err));
        } else {

            queryStr = 'SELECT queries.query_extern AS dataset_name, sub_datasets.sd_id AS dataset_id, sub_datasets.sd_description AS dataset_desc FROM queries INNER JOIN sub_datasets ON sub_datasets.sd_id = queries.sd_id;';
            params = [];

            client.query(queryStr, params, function (err, result_dataset) {
                if(err) {
                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                    return console.error(errors.database.error_2.message, err);
                } else {

                    var _output = "";

                    fs.readFile(path.join(__dirname, '../../templates/rdf_prefix'), function(err, data) {
                        if (err) throw err;

                        var template = data.toString();
                        var output = mustache.render(template);
                        _output = output;

                        async.eachSeries(result_app, function (app, callback) {
                            var usages = [];

                            //GET Datasets used by app
                            queryStr = 'SELECT count(logs.sd_id) AS calls, logs.sd_id AS dataset_id FROM logs WHERE logs.app_hash=$1 GROUP BY logs.sd_id ORDER BY calls DESC;';
                            params = [app.app_id];

                            client.query(queryStr, params, function (err, result_usage) {
                                if(err) {
                                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                    return console.error(errors.database.error_2.message, err);
                                } else {
                                    async.eachSeries(result_usage, function (usage, _callback) {
                                        fs.readFile(path.join(__dirname, '../../templates/rdf_usage'), function(err, data) {
                                            if (err) throw err;

                                            usage.usage_id = usage.dataset_id+'_'+ app.app_id.substr(94,8);
                                            usages.push({usage_id: usage.usage_id});
                                            var template = data.toString();
                                            var output = mustache.render(template, usage);
                                            _output += output;

                                            _callback();
                                        });
                                    }, function (err) {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            app.app_id = app.app_id.substr(94,8);
                                            app.usages = usages;
                                            fs.readFile(path.join(__dirname, '../../templates/rdf_app'), function(err, data) {
                                                if (err) throw err;

                                                var template = data.toString();
                                                var output = mustache.render(template, app);
                                                _output += output;

                                                callback();
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
                                async.eachSeries(result_dataset, function (dataset, callback) {
                                    fs.readFile(path.join(__dirname, '../../templates/rdf_dataset'), function(err, data) {
                                        if (err) throw err;

                                        var template = data.toString();
                                        var output = mustache.render(template, dataset);
                                        _output += output;

                                        callback();
                                    });

                                    
                                }, function (err) {
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        res.status(200).send(_output);
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });

    */
};
