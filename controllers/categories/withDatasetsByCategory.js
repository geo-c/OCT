var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


exports.request = function(req, res) { 

    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(errors.database.error_1.code).send(errors.database.error_1);
            return console.error(errors.database.error_1.message, err);
        } else {
            categories = {
                data: []
            };
            client.query('SELECT category_id, md_name FROM categories_relationships INNER JOIN main_datasets ON main_datasets.md_id=categories_relationships.md_id WHERE category_id = $1;', [req.params.category_id], function(err, result) {
                done();

               if (err) {
                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                    return console.error(errors.database.error_2.message, err);
                } else {
                    res.status(200).send(result.rows)
                }
            });
        }
    });
};


var response = function (res, data) {
     console.log(data);
     //res.json(data);
}