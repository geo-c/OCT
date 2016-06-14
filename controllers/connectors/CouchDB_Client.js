var nano = require('nano')('http://giv-oct.uni-muenster.de:5984/');

var CouchDB_Client = function() {
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

CouchDB_Client.prototype.query = function (cb) {
	if(this.database == null) {
		this.useDatabase();
	}
	var name = this.database_name;
	this.database.list('', function (err, body) {
		var result = [];
		if(!err) {
			for(var i in body.rows) {
				rev = body.rows[i].value;
				doc = body.rows[i].key;
				nano.request({
					db: name,
					doc:doc,
					method:'get',
					params: { rev:rev}
					}, function (err, body) {
						if(!err) {
							result.push(body);
						}
					});
			}
		} else {
			console.log(err);
		}
		cb(result);
	});
}


module.exports = CouchDB_Client;
