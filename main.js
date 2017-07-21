var config = require('./config');
var restify = require('restify');
var errs = require('restify-errors');
var db = require('./db');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer({
  name: config.name,
  version: config.version,
});

server.pre(restify.plugins.pre.userAgentConnection());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());


// GET method to get value by key and timestamp (optional)
server.get('/object/:keyIn', function (req, res, next) {
  var timestampIn = undefined;
  // Check timestamp exists and is a valid long
  if (req.query.timestamp) {
    timestampIn = parseInt(req.query.timestamp);
    if (isNaN(timestampIn)) {
      res.send(new errs.InvalidArgumentError(req.query.timestamp + ' is not a valid timestamp'));
      return next();
    }
  }

  // DB action
  db.getValueByKey(req.params.keyIn, timestampIn).done(function (result) {
    res.send(result);
    next();
  }, function (rejectReason) {
    res.send(new errs.NotFoundError('No key-value pair found'));
    next();
  });
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
        next();
      }, function (rejectReason) {
        console.log(rejectReason);
        res.send(new errs.InvalidArgumentError(rejectReason));
        next();
      });
    }
    else {
      res.send(new errs.InvalidArgumentError('Invalid number of key-value pairs'));
      next();
    }
  }
  else {
    res.send(new errs.InvalidArgumentError('Invalid request body'));
    next();
  }
});

server.on('InternalServer', function (req, res, err, cb) {
  // if you don't want restify to automatically render the Error object
  // as a JSON response, you can customize the response by setting the
  // `body` property of the error
  err.body = 'Sorry but error happens';
  return cb();
});

server.on('uncaughtException', (req, res, route, err) => {
  log.error(err.stack)
  res.send(err)
});

server.listen(config.port, function () {
  console.log('%s listening at %s', server.name, server.url);
  try {
    db.initDB(config.db.uri);
  }
  catch (err) {
    log.error('SQLite init error: ' + err);
    process.exit(1);
  }
});