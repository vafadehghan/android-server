/*---------------------------------------------------------------------------------------
--	SOURCE FILE: server.js - The web server for the location finder
--
--	PROGRAM:     Location Finder
--
--	DATE:        April 5, 2018
--
--	FUNCTIONS:
--					function newConnection(connection)
--					function clientConnected(d)
--          function clientDisconnect()
--					function error(err)
--
--
--	DESIGNERS:		Vafa Dehghan Saei
--
--	PROGRAMMERS:	Vafa Dehghan Saei
--
--
--	NOTES:
--  This program will create a server that will listen on port 9000.
--  The program will make an entry into the client dictionary with the location and name of the client.
--  It will then add the location and name to the JSON file which will be read by the map.
--  Once the client is disconnected the entry is removed from the JSON.
---------------------------------------------------------------------------------------*/

var net = require('net');
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

server.on('connection', newConnection);

server.listen(9000, function() {
  console.log('server listening to: ' + JSON.stringify(server.address()) + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
});

/*----------------------------------------------------------------------
-- FUNCTION:	  newConnection
--
-- DATE:        April 5, 2018
--
-- DESIGNER:    Vafa Dehghan Saei
--
-- PROGRAMMER:  Vafa Dehghan Saei
--
-- INTERFACE: 	function newConnection(connection)
--
-- ARGUMENT:    var connection - an object representing a connected client
--
--
-- RETURNS:     void
--
-- NOTES:
-- When there is a new connection this function will run.
-- The clients address is printed to the console.
-- This function will also define the functions to handle the new data, disconnect and error events.
----------------------------------------------------------------------*/
function newConnection(connection) {
  var remoteAddress = connection.remoteAddress + ':' + connection.remotePort;
  console.log('new client connection from: ' + remoteAddress + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());

  connection.on('data', clientConnected);
  connection.on('error', error);
  connection.once('close', clientDisconnect);

  clients[connection.remoteAddress] = client("name", 0, 0, connection.remoteAddress);


  /*----------------------------------------------------------------------
  -- FUNCTION:	  clientConnected
  --
  -- DATE:        April 5, 2018
  --
  -- DESIGNER:    Vafa Dehghan Saei
  --
  -- PROGRAMMER:  Vafa Dehghan Saei
  --
  -- INTERFACE: 	function clientConnected(d)
  --
  -- ARGUMENT:    var d - a Buffer or String which is the data received
  --
  --
  -- RETURNS:     void
  --
  -- NOTES:
  -- When there is a new connection this function will run.
  -- The clients name and location is added to a client dictionary.
  -- This function will also define the functions to handle the new data, disconnect and error events.
  ----------------------------------------------------------------------*/
  function clientConnected(d) {
    console.log('Address: ' + remoteAddress + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
    console.log('Data: ' + d + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
    if (d != " ") {
      var data = "" + d;
      var message = data.split("_");

      var name = message[0];
      var client_x = message[1];
      var client_y = message[2];

      console.log("-> " + name + " x:" + client_x + " y:" + client_y + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());

      clients[connection.remoteAddress].name = name;
      clients[connection.remoteAddress].x = client_x;
      clients[connection.remoteAddress].y = client_y;
    }
  }

  /*----------------------------------------------------------------------
  -- FUNCTION:	  clientDisconnect
  --
  -- DATE:        April 5, 2018
  --
  -- DESIGNER:    Vafa Dehghan Saei
  --
  -- PROGRAMMER:  Vafa Dehghan Saei
  --
  -- INTERFACE: 	function clientDisconnect()
  --
  -- ARGUMENT:    void
  --
  --
  -- RETURNS:     void
  --
  -- NOTES:
  -- When a client disconnects this function is called.
  -- The client is removed from the dictionary, which will also remove it from the JSON.
  ----------------------------------------------------------------------*/
  function clientDisconnect() {
    delete clients[connection.remoteAddress];
    console.log('connection closed: ' + remoteAddress + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());


  }

  /*----------------------------------------------------------------------
  -- FUNCTION:	  error
  --
  -- DATE:        April 5, 2018
  --
  -- DESIGNER:    Vafa Dehghan Saei
  --
  -- PROGRAMMER:  Vafa Dehghan Saei
  --
  -- INTERFACE: 	function error(err)
  --
  -- ARGUMENT:    var err - an object representing the error
  --
  --
  -- RETURNS:     void
  --
  -- NOTES:
  -- When there is an error this function will run.
  -- The error is printed to the console.
  ----------------------------------------------------------------------*/
  function error(err) {
    console.log('err' + remoteAddress + " " + err.message + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
  }

}

app.set('views', __dirname + '/views');

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get('/data', function(req, res) {
  var password = req.query.password;
  if (password == "dc4985") {
    res.json({
      clients
    })
  } else {
    return res.status(403).send({
      success: false,
      message: 'Incorrect Password'
    });
  }
});

app.listen(8080);
