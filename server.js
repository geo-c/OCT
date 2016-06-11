var express = require('express');
var path = require('path');


// WEBSERVER
var app = express();
app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});


// WEBCLIENT
app.use(express.static(path.join(__dirname, '/public')));


module.exports = app;
