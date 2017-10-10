var errors = require('./../../config/errors');
var client = require('./../db.js');
var _ = require('underscore');

var Ajv = require('ajv');
var schema = require('../../models/update_ds');
var ajv = Ajv({"format": "full"});
var validate = ajv.compile(schema);


// POST
exports.request = function(req, res) {
	console.log("jaa")

	// Schema Validation
	var valid = validate(req.body);
    console.log(valid);
	if (!valid) {
		res.status(errors.schema.error_1.code).send(_.extend(errors.schema.error_1, {
			err: validate.errors[0].dataPath + ": " + validate.errors[0].message
		}));
		return console.error(validate.errors[0].dataPath + ": " + validate.errors[0].message);
	} else {
    	console.log(req.body);
    	var queryStr = "UPDATE Datastores SET updated=now(), ds_type=$1, ds_description=$2, ds_host=$3, ds_port=$4, db_instance=$5, db_user=$6, db_password=$7 WHERE ds_id=$8;";
		var params = [
			req.body.ds_type,
    		req.body.ds_description,
    		req.body.ds_host,
    		req.body.ds_port,
    		req.body.db_instance,
    		req.body.db_user,
    		req.body.db_password,
    		req.body.ds_id
		]
    	client.query(queryStr, params, function (err, result) {
            console.log("-")
    		if(err) {
    			console.log(err);
    			res.status(404).send(err);
    		} else {
                console.log("0")
    			var ds_id = result.ds_id;
    			client.query("UPDATE main_datasets SET updated=now(), md_name=$1, md_description=$2 WHERE md_id=$3;", [
    				req.body.md_name,
    				req.body.md_description,
    				req.body.md_id
    			], function (err, result) {
    				if(err) {
    					console.log(err);
    					res.status(404).send(err);
    				} else {
                        console.log("1")
    					client.query("UPDATE sub_datasets SET updated=now(), sd_name=$1, sd_description=$2 WHERE sd_id=$3;", [
    						req.body.sd_name,
    						req.body.sd_description,
    						req.body.sd_id
    					], function (err, result) {
    						if(err) {
    							console.log(err);
    							res.status(404).send(err);
    						} else {
                                console.log("2")
                                var active = "";
                                console.log(req.body.active);
                                if(req.body.active == "false") {
                                    active = false;
                                } else {
                                    active = true;
                                }
                                var queryStr = "UPDATE queries SET updated=now(), query_intern=$1, query_extern=$2, query_description=$3, active=$4 WHERE query_extern=$5;";
                                console.log(queryStr)
                                var params = [
                                    req.body.query_intern,
                                    req.body.query_extern,
                                    req.body.query_description,
                                    active,
                                    req.body.query_extern
                                ];
                                console.log(params);

    							client.query(queryStr , params , function (err, result) {
    								if(err) {
    									console.log(err);
    									res.status(404).send(err);
    								} else {
                                        console.log("3")
    									client.query("DELETE FROM categories_relationships WHERE md_id=$1;", [
    										req.body.md_id
    									], function (err, result) {
    										if(err) {
    											res.status(404).send(err);
    										} else {
                                                console.log("4")
                                                console.log(req.body.categories);
                                                if(req.body.categories.length == 0) {
                                                    res.status(200).send("Updated");
                                                }
    											for(i in req.body.categories) {
	        										category_name = req.body.categories[i];
	        										client.query("SELECT category_id FROM categories WHERE category_name = $1 ", [
	        											category_name
	        										], function (err, result) {
                                                        console.log("5");
	        											if(err) {
	        												console.log(err);
	        												res.status(404).send(err);
	        											} else {
	        												client.query("INSERT INTO categories_relationships (created, updated, md_id, category_id) VALUES (now(), now(), $1, $2)", [
	        													req.body.md_id,
	        													result.category_id
	        												], function (err, result) {
                                                                console.log("5")
	        													if(err) {
	        														console.log(err);
	        														res.status(404).send(err);
	        													} else {
	        														res.status(200).send("Updated");
	        													}
	        												});
	        											}
	        										});
	        									}	
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
};
