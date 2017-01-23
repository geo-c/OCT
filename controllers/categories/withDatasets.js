var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


exports.request = function(req, res) { 
    queryStr = 'SELECT c.category_name, c.category_id, (SELECT COUNT(cr.md_id) FROM categories_relationships cr WHERE cr.category_id=c.category_id) FROM categories c;';
    params = [];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            return console.error(errors.database.error_2.message, err);
        } else {
            res.status(200).send(result);
        }

    });


    
    /*
    var url = "postgres://" + db_settings.user + ":" + db_settings.password + "@" + db_settings.host + ":" + db_settings.port + "/" + db_settings.database_name;

    pg.connect(url, function(err, client, done) {
        if (err) {
            res.status(errors.database.error_1.code).send(errors.database.error_1);
            return console.error(errors.database.error_1.message, err);
        } else {
            categories = {
                data: []
            };
            client.query('SELECT c.category_name, c.category_id, (SELECT COUNT(cr.md_id) FROM categories_relationships cr WHERE cr.category_id=c.category_id) FROM categories c;', function(err, result) {
                done();

                if (err) {
                    res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
                    return console.error(errors.database.error_2.message, err);
                } else {
                    res.status(200).send(result.rows)
                }
            });
        }
    });*/
};
