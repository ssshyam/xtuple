/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true, latedef:true, newcap:true, noarg:true,
regexp:true, undef:true, strict:true, trailing:true, white:true */
/*global _:true */

(function () {
  "use strict";

  var async = require("async"),
    exec = require('child_process').exec,
    path = require('path'),
    os = require('os'),
    winston = require('winston'),
    dataSource = require('../../../node-datasource/lib/ext/datasource').dataSource,
    inspectDatabaseExtensions = require("./inspect_database").inspectDatabaseExtensions;

  //
  // Wipe out the database
  // and load it from scratch using pg_restore something.backup unless
  // we're building from source.
  //
  var initDatabase = function (spec, creds, callback) {
    var databaseName = spec.database,
      credsClone = JSON.parse(JSON.stringify(creds)),
      dropDatabase = function (done) {
        winston.info("Dropping database " + databaseName);
        // the calls to drop and create the database need to be run against the database "postgres"
        credsClone.database = "postgres";
        dataSource.query("drop database if exists " + databaseName + ";", credsClone, done);
      },
      createDatabase = function (done) {
        winston.info("Creating database " + databaseName);
        dataSource.query("create database " + databaseName + " template template1;", credsClone, done);
      },
      buildSchema = function (done) {
        var schemaPath = path.join(path.dirname(spec.source), "440_schema.sql");
        winston.info("Building schema for database " + databaseName);

        exec("psql -U " + creds.username + " -h " + creds.hostname + " --single-transaction -p " +
          creds.port + " -d " + databaseName + " -f " + schemaPath,
          {maxBuffer: 40000 * 1024 /* 200x default */}, done);
      },
      populateData = function (done) {
        winston.info("Populating data for database " + databaseName + " from " + spec.source);
        exec("psql -U " + creds.username + " -h " + creds.hostname + " --single-transaction -p " +
          creds.port + " -d " + databaseName + " -f " + spec.source,
          {maxBuffer: 40000 * 1024 /* 200x default */}, done);
      },
      // use exec to restore the backup. The alternative, reading the backup file into a string to query
      // doesn't work because the backup file is binary.
      restoreBackup = function (done) {
        exec("pg_restore -U " + creds.username + " -h " + creds.hostname + " -p " +
          creds.port + " -d " + databaseName + " -j " + os.cpus().length + " " + spec.backup, function (err, res) {
          if (err) {
            console.log("ignoring restore db error", err);
          }
          done(null, res);
        });
      },
      finish = function (err, results) {
        if (err) {
          winston.error("init database error", err.message, err.stack, err);
        }
        callback(err, results);
      };

    if (spec.source) {
      async.series([
        dropDatabase,
        createDatabase,
        buildSchema,
        populateData
      ], finish);
    } else {
      async.series([
        dropDatabase,
        createDatabase,
        restoreBackup,
        function (done) {
          credsClone.database = databaseName;
          inspectDatabaseExtensions(credsClone, function (err, paths) {
            // in the case of a build-from-backup, we ignore any user desires and dictate the extensions
            spec.extensions = paths;
            done();
          });
        }
      ], finish);
    }
  };

  exports.initDatabase = initDatabase;
}());
