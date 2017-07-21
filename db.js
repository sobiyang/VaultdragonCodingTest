var sqlite3 = require('sqlite3').verbose();
var Promise = require('promise');

var engine = null;
// All DB methods
var db = {
    // Instantiate SQLite
    initDB: function (uri, busyTimeout) {
        engine = new sqlite3.Database(uri);
        engine.configure("busyTimeout", busyTimeout * 1000)
        engine.serialize(function () {
            // Create the key-value table
            engine.run('CREATE TABLE IF NOT EXISTS KeyValue (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT, value BLOB, update_time DATETIME UNIQUE)');
        });
    },
    // Get value by key and timestamp (optional)
    getValueByKey: function (keyIn, timestampIn) {
        return new Promise(function (fulfill, reject) {
            query = 'SELECT key, value, update_time FROM KeyValue WHERE key = ?';
            if (timestampIn && timestampIn !== null)
                query += ' AND update_time <= ?';
            query += ' ORDER BY update_time DESC LIMIT 1'
            engine.get(query, keyIn, timestampIn, function (err, row) {
                if (err)
                    reject(err);
                else if (!row)
                    reject('No result found');
                else
                    fulfill(row);
            });
        });
    },
    // Insert a new key-value pair
    insertUpdateEntry: function (keyIn, valueIn, timestampIn) {
        return new Promise(function (fulfill, reject) {
            engine.run("INSERT OR REPLACE INTO KeyValue (key, value, update_time) VALUES (?, ?, ?)", [keyIn, valueIn, timestampIn], function (err) {
                if (err)
                    reject(err);
                else
                    fulfill({ "key": keyIn, "value": valueIn, "timestamp": timestampIn });
            });
        });
    }
};

module.exports = db;