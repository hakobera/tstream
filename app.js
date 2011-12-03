
/**
 * Module dependencies.
 */

var express = require('express')
  , sio = require('socket.io')
  , routes = require('./routes')
  , TwitterStream = require('./lib/tstream');

var app = module.exports = express.createServer(),
    io = sio.listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

// Twitte Stream with Socket.IO
var stream = new TwitterStream('a');
stream.on('data', function(data) {
  io.sockets.emit('data', data);
});
stream.open();

io.sockets.on('connection', function (socket) {
  console.log('connected %d', socket.id);
});

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);