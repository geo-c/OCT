var nano;

var CouchDB_Client = function(host, port) {
	url = host + ':' + port + '/';
	nano = require('nano')(url);
	var database = null;
	var database_name = '';
};

CouchDB_Client.prototype.useDatabase = function (name) {
	if (name == "" || name == null) {
		name = "smart-cities";
	}
	this.database = nano.db.use(name);
	this.database_name = name;
}

CouchDB_Client.prototype.query = function (query_string, cb) {
	if(this.database == null) {
		this.useDatabase();
	}
	var name = this.database_name;
	this.database.get(query_string, function (err, body) {
		if(err) {
			cb(err, null);
		} else {
			cb(null, body);
		}
	});
}


module.exports = CouchDB_Client;
