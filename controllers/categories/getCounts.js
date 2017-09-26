var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');


// Count of Logs by Day
exports.request = function(req, res) {

    queryStr = 'SELECT count(logs.category_id) AS Searches, (SELECT COUNT(cr.md_id) FROM categories_relationships cr WHERE cr.category_id=c.category_id) AS Datasets FROM public.categories c INNER JOIN logs ON c.category_id=logs.category_id WHERE c.category_id=$1 GROUP BY c.category_name, c.category_id ORDER BY c.category_name;';
    params = [req.params.category_id];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            return console.error(errors.database.error_2.message, err);
        } else {
            res.status(200).send(result);
        }

    });
};