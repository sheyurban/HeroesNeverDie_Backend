const config = require("config");
const mongoose = require("mongoose");
const logger = require("../config/winston");

let _db;

const connectionString = config.get("db.connectionString");
const UserService = require("../endpoints/user/UserService");

function initDb(callback) {
  if (_db) {
    if (callback) return callback(null, _db);
    else return _db;
  } else {
    mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    _db = mongoose.connection;
    _db.on("error", console.error.bind(console, "connection error: "));
    _db.once("open", () => {
      logger.debug(
        "Connected to database " + connectionString + " in DB js: " + _db.name
      );
      UserService.findUserBy("admin", (err, user) => {
        if (err || !user) return callback(err, null);
        return callback(null, _db);
      });
    });
  }
}

function getDb() {
  return _db;
}

function close() {
  logger.debug("Function still missing. (db.close())");
}

module.exports = { getDb, initDb };
