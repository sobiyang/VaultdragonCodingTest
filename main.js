var config = require('./config');
var restify = require('restify');
var errs = require('restify-errors');
var db = require('./db');

var server = restify.createServer({
  name: config.name,
  version: config.version,
});

server.server.setTimeout(config.timeout * 1000);

server.pre(restify.plugins.pre.userAgentConnection());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.use(function (req, res, next) {
  // Check API key
  if (req.query.api_key && req.query.api_key !== null) {
    if (req.query.api_key === config.api_key) {
      return next();
    }
    else {
      return next(new errs.NotAuthorizedError("Invalid API key supplied"));
    }
  } else {
    return next(new errs.NotAuthorizedError("No API key supplied"));
  }
});

// GET method to get value by key and timestamp (optional)
server.get('/object/:keyIn', function (req, res, next) {
  var timestampIn = undefined;
  // Check timestamp exists and is a valid long
  if (req.query.timestamp) {
    timestampIn = parseInt(req.query.timestamp);
    // Check timestamp is a long integer representing milliseconds
    // and number of digits must exceed 12 (after year 2001)
    if (isNaN(timestampIn) || req.query.timestamp.length < 12) {
      res.send(new errs.InvalidArgumentError(req.query.timestamp + ' is not a valid timestamp in milliseconds'));
      return next();
    }
  }

  // DB action
  db.getValueByKey(req.params.keyIn, timestampIn).done(function (row) {
    // Format the result
    var result = {
      'value': row.value
    }
    res.send(result);
  }, function (rejectReason) {
    res.send(new errs.NotFoundError('No key-value pair found'));
  });
  return next();
});

// POST method to insert a new record
server.post('/object', function (req, res, next) {
  // Check request body exists
  if (req.body) {
    var keys = Object.keys(req.body);
    // Check request body has exacly one key-value pair
    if (keys.length === 1) {
      db.insertUpdateEntry(keys[0], req.body[keys[0]], req.date()).done(function (result) {
        res.send(result);
      }, function (rejectReason) {
        console.log(rejectReason);
        res.send(new errs.InvalidArgumentError(rejectReason));
      });
    }
    else {
      res.send(new errs.InvalidArgumentError('Invalid number of key-value pairs'));
    }
  }
  else {
    res.send(new errs.InvalidArgumentError('Invalid request body'));
  }
  return next();
});

// Internal Server error
server.on('InternalServer', function (req, res, err, cb) {
  err.body = 'Sorry but error happens';
  return cb();
});

// Global uncaught exception
server.on('uncaughtException', (req, res, route, err) => {
  console.log(err.stack)
  res.send(err)
  return next();
});

server.listen(config.port, function () {
  console.log('%s listening at %s', server.name, server.url);
  try {
    // Init database 
    db.initDB(config.db.uri, config.db.busyTimeout);
    console.log('SQLite init done');
  }
  catch (err) {
    console.log('SQLite init error: ' + err);
    process.exit(1);
  }
});