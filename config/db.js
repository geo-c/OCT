/**
 * Configurate and connect Webserver to PostgreSQL-Database
 * Username and Password has to be specified in the Command-Line-Parameters
 */
module.exports = {
    host: "127.0.0.1",
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    admin: "oct-admin"
};


