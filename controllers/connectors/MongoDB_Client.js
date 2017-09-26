var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var url;


var MongoDB_Client = function(url) {
	this.url= url;
};


MongoDB_Client.prototype.query = function (query_string, database, cb) {
	MongoClient.connect(this.url, function(err, db) {
		if(err) {
			throw err;
		}
		var query = query_string;
		db.collection("Attention").count(function(err, count) {
			console.log(count);
		})

		db.collection("channely-production").find().toArray(function(err, result) {
			if(err) {
				throw err;
			}
			console.log(result);
			db.close();
			cb(result);
		});
	});
}


module.exports = MongoDB_Client;
