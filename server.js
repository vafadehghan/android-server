var net = require('net');
var timestamp = require('console-timestamp');
var express = require('express');
var path = require('path');
var app = express();

var clients = {};
var now = new Date();

var client = function(name, x, y, ip) {
  return {
    "name": name,
    "x": x,
    "y": y,
    "ip": ip
  };
};


var server = net.createServer();
server.on('connection', handle_connection);

server.listen(9000, function() {
  console.log('server listening to: ' + JSON.stringify(server.address()) +" " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
});


function handle_connection(connection) {
  var remoteAddress = connection.remoteAddress + ':' + connection.remotePort;
  console.log('new client connection from: ' + remoteAddress +" " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());

  connection.on('data', on_connection);
  connection.once('close', on_close);
  connection.on('error', on_error);

  clients[connection.remoteAddress] = client("name", 0, 0, connection.remoteAddress);
  console.log(clients[connection.remoteAddress] +" " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());

  function on_connection(d) {
    console.log('Address: ' + remoteAddress +" " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
    console.log('Data: ' + d +" " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());

    var data = "" + d;
    var message = data.split("_");

    var name = message[0];
    var client_x = message[1];
    var client_y = message[2];

    console.log("-> " + name + " x:" + client_x + " y:" + client_y +" " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());

    clients[connection.remoteAddress].name = name;
    clients[connection.remoteAddress].x = client_x;
    clients[connection.remoteAddress].y = client_y;

    console.log(clients +" " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
    connection.write(d);
  }

  function on_close() {
    delete clients[connection.remoteAddress];
    console.log('connection closed: ' + remoteAddress +" " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());


  }

  function on_error(err) {
    console.log('err' + remoteAddress + " " + err.message +" " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
  }

}



app.set('views', __dirname + '/views');
app.use(express.static('public'));


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
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
