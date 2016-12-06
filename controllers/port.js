var db_settings = require('../server.js').db_settings;


// LIST
exports.request = function(req, res) {
    res.status(200).send(db_settings.api_port);
};
