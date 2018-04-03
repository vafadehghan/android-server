var net = require('net');
var timestamp = require('console-timestamp');
var express = require('express');
var path = require('path');
var pug = require('pug');
var app = express();

var clients = {};

var client = function(name, point, ip) {
  return {
    "name": name,
    "point": point,
    "ip": ip
  };
};

var point = function(x, y) {
  return {
    "x": x,
    "y": y
  };
};

var server = net.createServer();
server.on('connection', handle_connection);

server.listen(9000, function() {
  log('server listening to: ' + JSON.stringify(server.address()));
});


function handle_connection(connection) {

  var remoteAddress = connection.remoteAddress + ':' + connection.remotePort;
  log('new client connection from: ' + remoteAddress);

  connection.on('data', on_connection);
  connection.once('close', on_close);
  connection.on('error', on_error);

  clients[connection.remoteAddress] = client("name", point(0, 0), connection.remoteAddress);
  console.log(clients[connection.remoteAddress]);

  function on_connection(d) {

    log('Address: ' + remoteAddress);
    log('Data: ' + d);

    var data = "" + d;
    var message = data.split("_");

    var name = message[0];
    var client_x = message[1];
    var client_y = message[2];

    log("-> " + name + " x:" + client_x + " y:" + client_y);

    clients[connection.remoteAddress].name = name;
    clients[connection.remoteAddress].point.x = client_x;
    clients[connection.remoteAddress].point.y = client_y;

    console.log(clients);
    connection.write(d);
  }

  function on_close() {
	clients[connection.remoteAddress].name = 0;
    clients[connection.remoteAddress].point.x = 0;
    clients[connection.remoteAddress].point.y = 0;
    log('connection closed: ' + remoteAddress);
	
	
  }

  function on_error(err) {
    log('err' + remoteAddress + " " + err.message);
  }

}

function log(msg) {
  var now = new Date();
  console.log("[ " + timestamp('MM-DD hh:mm:ss', now) + " ] " + msg);
}

app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.set('view engine', 'pug');

app.get('/', function(req, res) {
  res.render("index");
});

app.get('/json', function(req, res) {

  var password = req.query.password;

  if (password == "dc4985") {
    res.json({
      clients
    })
  } else {
    return res.status(403).send({
      success: false,
      message: 'Invalid password'
    });
  }
});

app.listen(80);
