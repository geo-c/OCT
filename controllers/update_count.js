var errors = require('./../config/errors');
var client = require('./db.js');
var _ = require('underscore');


// LIST
exports.request = function(req, res) {
    res.status(404).send({status: "In Process"});
    //Apps
    var queryStr = 'SELECT apps.app_hash, (SELECT COUNT(logs.category_id) FROM public.logs WHERE logs.app_hash = apps.app_hash) AS Searches FROM public.apps;';
    var params = [];
    client.query(queryStr, params, function (err, result) {
        if(err) {
        } else {
            for(index in result) {
                (function(index) {
                    queryStr = "UPDATE logs_count SET count=$1 WHERE app_hash=$2 AND type='App_Category';";
                    params = [result[index].searches, result[index].app_hash ];
                    client.query(queryStr, params, function(err, result2) {
                        if(!err) {
                            queryStr = "INSERT INTO logs_count (type, app_hash, count) SELECT 'App_Category', CAST($2 AS CHARACTER VARYING(255)), $1 WHERE NOT EXISTS(SELECT 1 FROM logs_count WHERE app_hash=$2 AND type = 'App_Category')";
                            params = [result[index].searches, result[index].app_hash ];
                            client.query(queryStr, params, function(err, result3) {

                            });
                        }
                    });
                })(index)
            };
        }
    });

    var queryStr = 'SELECT apps.app_hash, (SELECT COUNT(logs.sd_id) FROM public.logs WHERE logs.app_hash = apps.app_hash) AS API_Calls FROM public.apps;';
    var params = [];
    client.query(queryStr, params, function (err, result) {
        if(err) {
        } else {

            for(index in result) {
                (function(index) {
                    queryStr = "UPDATE logs_count SET count=$1 WHERE app_hash=$2 AND type='App_Dataset';";
                    params = [result[index].api_calls, result[index].app_hash ];
                    client.query(queryStr, params, function(err, result2) {
                        if(!err) {
                            queryStr = "INSERT INTO logs_count (type, app_hash, count) SELECT 'App_Dataset', CAST($2 AS CHARACTER VARYING(255)), $1 WHERE NOT EXISTS(SELECT 1 FROM logs_count WHERE app_hash=$2 AND type = 'App_Dataset')";
                            params = [result[index].api_calls, result[index].app_hash ];
                            client.query(queryStr, params, function(err, result3) {});
                        }
                    });
                })(index);
            };
        }
    });
    
    
    //Categories
    var queryStr = 'SELECT c.category_id,  count(logs.category_id) AS Searches FROM public.categories c INNER JOIN logs ON c.category_id=logs.category_id GROUP BY c.category_id ORDER BY c.category_id;';
    var params = [];
    console.log("querys")
    client.query(queryStr, params, function (err, result) {
        if(err) {
        } else {
            for(index in result) {
                (function(index) {
                    queryStr = "UPDATE logs_count SET count=$1 WHERE category_id=$2 AND type='Category_Searches';";
                    params = [result[index].searches, result[index].category_id ];
                    client.query(queryStr, params, function(err, result2) {
                        if(!err) {
                            queryStr = "INSERT INTO logs_count (type, category_id, count) SELECT 'Category_Searches', $2, $1 WHERE NOT EXISTS(SELECT 1 FROM logs_count WHERE category_id=$2 AND type = 'Category_Searches')";
                            params = [result[index].searches, result[index].category_id ];
                            client.query(queryStr, params, function(err, result3) {});
                        }
                    });
                })(index);
            };
        }
    });

    var queryStr = 'SELECT c.category_id, (SELECT COUNT(cr.md_id) FROM categories_relationships cr WHERE cr.category_id=c.category_id) AS Datasets FROM public.categories c;';
    var params = [];
    client.query(queryStr, params, function (err, result) {
        if(err) {
        } else {
            for(index in result) {
                (function(index) {
                    queryStr = "UPDATE logs_count SET count=$1 WHERE category_id=$2 AND type='Category_Datasets';";
                    params = [result[index].datasets, result[index].category_id ];
                    client.query(queryStr, params, function(err, result2) {
                        if(!err) {
                            queryStr = "INSERT INTO logs_count (type, category_id, count) SELECT 'Category_Datasets', $2, $1 WHERE NOT EXISTS(SELECT 1 FROM logs_count WHERE category_id=$2 AND type = 'Category_Datasets')";
                            params = [result[index].datasets, result[index].category_id ];
                            client.query(queryStr, params, function(err, result3) {});
                        }
                    });
                })(index);
            };
        }
    });


    //Usage
    var queryStr = 'SELECT logs."timestamp"::timestamp::date as date, count(logs.category_id) AS Searches FROM public.logs GROUP BY date ORDER BY date;';
    var params = [];
    client.query(queryStr, params, function (err, result) {
        if(err) {
        } else {
            for(index in result) {
                (function(index) {
                    console.log(result[index])
                    queryStr = "UPDATE logs_count SET count=$1 WHERE day=$2 AND type='Usage_Category';";
                    params = [result[index].searches, result[index].date ];
                    client.query(queryStr, params, function(err, result2) {
                        if(!err) {
                            queryStr = "INSERT INTO logs_count (type, day, count) SELECT 'Usage_Category', $2, $1 WHERE NOT EXISTS(SELECT 1 FROM logs_count WHERE day=$2 AND type = 'Usage_Category')";
                            params = [result[index].searches, result[index].date ];
                            client.query(queryStr, params, function(err, result3) {console.log(err)});
                        }
                    });
                })(index);
            };
        }
    });

    var queryStr = 'SELECT logs."timestamp"::timestamp::date as date, count(logs.sd_id) AS API_Calls FROM public.logs GROUP BY date ORDER BY date;';
    var params = [];
    client.query(queryStr, params, function (err, result) {
        if(err) {
        } else {
            for(index in result) {
                (function(index) {
                    queryStr = "UPDATE logs_count SET count=$1 WHERE day=$2 AND type='Usage_Dataset';";
                    params = [result[index].api_calls, result[index].date ];
                    client.query(queryStr, params, function(err, result2) {
                        if(!err) {
                            queryStr = "INSERT INTO logs_count (type, day, count) SELECT 'Usage_Dataset', $2, $1 WHERE NOT EXISTS(SELECT 1 FROM logs_count WHERE day=$2 AND type = 'Usage_Dataset')";
                            params = [result[index].api_calls, result[index].date ];
                            client.query(queryStr, params, function(err, result3) {console.log(err)});
                        }
                    });
                })(index);
            };
        }
    });

    
    //Dataset
    var queryStr = 'SELECT sub_datasets.sd_id, (SELECT COUNT(logs.sd_id) FROM logs WHERE logs.sd_id=sub_datasets.sd_id) AS Count FROM queries sub_datasets;';
    var params = [];
    client.query(queryStr, params, function (err, result) {
        if(err) {
        } else {
            for(index in result) {
                (function(index) {
                    queryStr = "UPDATE logs_count SET count=$1 WHERE sd_id=$2 AND type='Dataset_Search';";
                    params = [result[index].count, result[index].sd_id ];
                    client.query(queryStr, params, function(err, result2) {
                        if(!err) {
                            queryStr = "INSERT INTO logs_count (type, sd_id, count) SELECT 'Dataset_Search', $2, $1 WHERE NOT EXISTS(SELECT 1 FROM logs_count WHERE sd_id=$2 AND type = 'Dataset_Search')";
                            params = [result[index].count, result[index].sd_id ];
                            client.query(queryStr, params, function(err, result3) {console.log(err)});
                        }
                    });
                })(index);
            };
        }
    });
};
