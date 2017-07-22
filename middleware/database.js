const connectToSqlite = require('../database/sqlite');

module.exports = function databaseMiddleware() {
    var connection = connectToSqlite();
    
    return function addDatabaseToRequest(req, res, next) {
        connection.then(function (database) {
            req.database = database;
            next();
        })
    }
};