"use strict";

function connectToSqlite() {
    const Sqlite = require('sqlite3');
    Sqlite.verbose();
    const fileSystem = require('fs');
    const path = require('path');

    const databaseFile = ":memory:";
    const regenerate = true;
    const sqliteMode = Sqlite.OPEN_READWRITE | Sqlite.OPEN_CREATE;
    var database;

    function executeFile(file, directory) {
        console.info('Executing ' + file);
        var fileContents = fileSystem.readFileSync(path.join(directory, file), {
            encoding: 'utf-8'
        });
        return new Promise(function (resolve, reject) {
            console.log(fileContents);
            database.exec(fileContents, function (err) {
                if (err) {
                    console.info('Error Executing ' + file);
                    console.error(err.message);
                    reject(err);
                    return;
                }
                console.info('Finished Executing ' + file);
                resolve();
            });
        })
    }

    function loadDatabaseSchema() {
        if (!regenerate) {
            return Promise.resolve();
        }
        const directory = path.join(__dirname, 'schema');
        const files = fileSystem.readdirSync(directory);
        return files.reduce(function (resolveChain, file) {
            return resolveChain.then(function () {
                return executeFile(file, directory);
            })
        }, Promise.resolve());
    }

    function loadSeedData() {
        if (!regenerate) {
            return Promise.resolve();
        }
        const directory = path.join(__dirname, 'seed');
        const files = fileSystem.readdirSync(directory);
        return files.reduce(function (resolveChain, file) {
            return resolveChain.then(function () {
                return executeFile(file, directory);
            })
        }, Promise.resolve());
    }

    return new Promise(function (resolve, reject) {
        new Sqlite.Database(databaseFile, sqliteMode, function (err) {
            if (err) {
                console.error(err.message);
                throw err;
            }
            database = this;
            console.info('Sqlite Database connection established.');
            loadDatabaseSchema().then(function () {
                loadSeedData();
            }).then(function () {
                resolve(database);
            }).catch(function (err) {
                console.error(err.message);
                throw err;
            })
        });
    });
}

module.exports = connectToSqlite;




