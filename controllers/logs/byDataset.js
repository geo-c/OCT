var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


// LIST
exports.request = function(req, res) {
    queryStr = 'SELECT * FROM Apps WHERE app_hash=$1;';
    params = [req.params.app_hash];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            return console.error(errors.database.error_2.message, err);
        } else {

            console.log(result);
            queryStr = 'SELECT count(logs.sd_id) AS count, queries.query_extern AS dataset FROM logs INNER JOIN sub_datasets on logs.sd_id=sub_datasets.sd_id INNER JOIN queries ON queries.sd_id = sub_datasets.sd_id WHERE app_hash=$1 GROUP BY queries.query_extern ORDER BY count DESC;';
            params = [req.params.app_hash];

            client.query(queryStr, params, function (err, result) {
                if(err) {
                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                    return console.error(errors.database.error_2.message, err);
                } else {
                    res.status(200).send(result);
                }

            });
        }

    });



    /*var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(errors.database.error_1.code).send(errors.database.error_1);
            return console.error(errors.database.error_1.message, err);
        } else {

            // Database Query
            client.query('SELECT * FROM Apps WHERE app_hash=$1;', [
                req.params.app_hash
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

                        // Database Query
                        client.query('SELECT count(logs.sd_id) AS count, queries.query_extern AS dataset FROM logs INNER JOIN sub_datasets on logs.sd_id=sub_datasets.sd_id INNER JOIN queries ON queries.sd_id = sub_datasets.sd_id WHERE app_hash=$1 GROUP BY queries.query_extern ORDER BY count DESC;', [
                            req.params.app_hash
                        ], function(err, result) {
                            done();

                            if (err) {
                                res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                                return console.error(errors.database.error_2.message, err);
                            } else {

                                // Send Result
                                res.status(200).send(result.rows);
                            }
                        });
                    }
                }
            });
        }
    });*/
};
