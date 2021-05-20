const config = require("config");
const mongoose = require("mongoose");

let _db;

const connectionString = config.get("db.connectionString");

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
      console.log(
        "Connected to database " + connectionString + " in DB js: " + _db.name
      );
      callback(null, _db);
    });
  }
}

function getDb() {
  return _db;
}

function close() {
  console.log("Function still missing. (db.close())");
}

module.exports = { getDb, initDb };
