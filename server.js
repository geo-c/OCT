var program = require('commander');
var path = require('path');
var _ = require('underscore');


/**
 * Check Command-Line parameters
 */
program
    .version('1.0.0')
    .option('-dbu, --postgres_user [username]', 'Enter the PostgreSQL-User, which is needed to start REST-API', 'admin')
    .option('-dbpw, --postgres_password [password]', 'Enter the PostgreSQL-Password, which is needed to start REST-API', 'password')
    .option('-emu, --email_user [email-address]', 'Enter the SMTP-address (example: user@gmail.com)', 'user@gmail.com')
    .option('-empw, --email_password [password]', 'Enter the Email-Password', 'password')
    .parse(process.argv);



// Check if Postgres-User and Postgres-Password were set, otherwise run only simple webserver without REST-API
var db_settings = {
    status: false,
    user: "",
    password: ""
};
db_settings = _.extend(db_settings, require('./config/db'));
if(program.postgres_user != "admin" && program.postgres_password != "password"){
    db_settings.status = true;
    db_settings.user = program.postgres_user;
    db_settings.password = program.postgres_password;
    exports.db_settings = db_settings;
}

// Check if a SMTP-address and Password were set, otherwise run only simple webserver without REST-API
var email_settings = {
    status : false,
    user: "",
    password: ""
};
if(program.email_user != "user@gmail.com" && program.email_password != "password"){
    email_settings.status = true;
    email_settings.user = program.email_user;
    email_settings.password = program.email_password;
    exports.email_settings = email_settings;
}


/**
 * Start Webserver
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);

// Set Server-Port
var port = process.env.PORT || 8080;
server.listen(port, function () {
    console.log('Webserver is listening at port %d', port);
});

// Set Webserver-Settings
app.use(bodyParser.json({
    limit: 52428800 // 50MB
}));
app.use(bodyParser.urlencoded({
    extended: false,
    limit: 52428800 // 50MB
}));
app.use(cookieParser());

// Set folder for static files (WebClient)
app.use(express.static(__dirname + '/public'));


/**
 * Use REST-API
 */
if(db_settings.status && email_settings.status){

    console.log('PostgreSQL-Database is listening at port ' + db_settings.port);
    console.log('REST-API is listening at endpoint /api/...');

    // Load dependencies
    var signup = require ('./routes/signup');
    var reset = require ('./routes/reset');
    var query = require('./routes/query');
    var apps = require('./routes/apps');
    var logs = require('./routes/logs');

    // Load Routes
    app.use('/api', signup);
    app.use('/api', reset);
    app.use('/api', query);
    app.use('/api', apps);
    app.use('/api', logs);

} else {
    console.log("Simple Webserver (no REST-API, Database and Email-Service started)");
}


module.exports = app;
