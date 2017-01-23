var pg = require('pg');
var _ = require('underscore');
var jwt = require('jsonwebtoken');
var secret = require('./../../config/secret');
var db_settings = require('../../server.js').db_settings;
var errors = require('./../../config/errors');


// LIST
exports.request = function(req, res) {

    var queryStr = "SELECT queries.query_id, queries.query_extern, queries.query_intern, queries.query_description, string_agg(categories.category_name, ', ') AS category_name, endpoints.endpoint_host, endpoints.endpoint_port, endpoints.endpoint_path, datastores.ds_type, datastores.ds_host, datastores.ds_port, datastores.db_instance FROM main_datasets INNER JOIN sub_datasets ON main_datasets.md_id = sub_datasets.md_id INNER JOIN queries ON sub_datasets.sd_id = queries.sd_id INNER JOIN endpoints ON main_datasets.endpoint_id = endpoints.endpoint_id INNER JOIN datastores ON main_datasets.ds_id = datastores.ds_id INNER JOIN admins ON main_datasets.created_by = admins.username INNER JOIN categories_relationships On categories_relationships.md_id = main_datasets.md_id INNER JOIN categories ON categories_relationships.category_id = categories.category_id WHERE queries.active ='true' GROUP BY queries.query_id, queries.query_extern, queries.query_intern, queries.query_description, endpoints.endpoint_host, endpoints.endpoint_port, endpoints.endpoint_path, datastores.ds_type, datastores.ds_host, datastores.ds_port, datastores.db_instance;";
    var params = [];

    client.query(queryStr, params, function (err, result) {
        if(err) {
            res.status(errors.database.error_2.code).send(_.extend(errors.database.error_2, err));
            return console.error(errors.database.error_2.message, err);
        } else {
            res.status(200).send(result);
        }
    });

};