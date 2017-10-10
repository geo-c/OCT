var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


// Count of Logs by Day
exports.request = function(req, res) {

    queryStr = "WITH day AS (SELECT day FROM logs_count WHERE day IS NOT NULL) SELECT day AS date, (SELECT count FROM logs_count WHERE logs_count.day=day.day AND type='Usage_Category') AS Searches, (SELECT count FROM logs_count WHERE logs_count.day=day.day AND type='Usage_Dataset') AS API_Calls FROM day;";
    params = [];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            console.log(err);
            res.status(404).send(_.extend(errors.database.error_2, err));
        } else {
            res.status(200).send(result);
        }

    });



    /*
    //queryStr = "SELECT DISTINCT logs.timestamp::date AS date, (SELECT count FROM logs_count WHERE logs_count.day::date=logs.timestamp::date AND logs_count.type='Usage_Category') AS Searches, (SELECT count FROM logs_count WHERE logs_count.day::date=logs.timestamp::date AND logs_count.type='Usage_Dataset') AS API_Calls FROM logs";
    queryStr = "SELECT DISTINCT day::date AS date FROM logs_count ORDER BY date";
    params = [];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            console.log(err);
            res.status(404).send(_.extend(errors.database.error_2, err));
        } else {
            var len = result.length;
            var count = 0;
            for(index in result) {
                (function(index) {
                    result[index].api_calls=0;
                    result[index].searches=0;
                    queryStr = "SELECT count FROM logs_count WHERE day::date=to_timestamp($1, 'DD Mon YYYY') AND type='Usage_Dataset'";
                    params = [result[index].date];
                    client.query(queryStr, params, function (err, result2) {
                        if(err) {
                        } else {
                            result[index].api_calls=result2.count;
                            queryStr = "SELECT count FROM logs_count WHERE day::date=to_timestamp($1, 'DD Mon YYYY') AND type='Usage_Category'";
                            params = [result[index].date];
                            client.query(queryStr, params, function (err, result3) {
                                if(err) {
                                } else {
                                    result[index].searches=result3.count;
                                    count++;
                                    console.log(len);
                                    console.log(count);
                                    if(count >= len) {
                                        res.status(200).send(result);
                                    }
                                }
                            });
                        }
                    });
                })(index);
                
            }
        }

    });


*/


};


