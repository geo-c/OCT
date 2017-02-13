var pg = require('pg');

var db = new function () {
	var pool = {};

	var that = this;

	this.init = function (settings) {
		console.log(settings);
		pool = new pg.Pool(settings); 
	}

	this.get = function () {
		return pool;
	}

	this.query = function (text, values, cb) {
		that.get().connect(function (err, client, done) {
	     	if (err) {
	     		return cb(err, null);
	     	} else {
	     		client.query(text, values, function (err, result) {
		       		done();
		       		if (err) {
		       			return cb(err, null);
		       		} else {
		       			cb(null, result.rows);
		       		}	
		     	});
	     	}
	   });
	}
}

module.exports = db;