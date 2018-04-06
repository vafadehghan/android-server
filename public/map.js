/*---------------------------------------------------------------------------------------
--	SOURCE FILE: map.js - The Google Maps API caller
--
--	PROGRAM:     Location Finder
--
--	DATE:        April 5, 2018
--
--	FUNCTIONS:
--					int main (int argc, char **argv)
--					void* readThreadFunc()
--					void* sendThreadFunc()
--					void printFunc()
--					void signal_catcher(int signo)
--
--
--	DESIGNERS:		Vafa Dehghan Saei
--
--	PROGRAMMERS:	Vafa Dehghan Saei
--
--
--	NOTES:
--	The program will establish a TCP connection to a user specifed server.
--  The server can be specified using a fully qualified domain name or and
--	IP address. After the connection has been established the user can type
--  messages to be sent to other connected clients. The client will also
--  display any incoming message sent from other clients through the server.
---------------------------------------------------------------------------------------*/

var x = 0;
var y = 0;
var userName;
var markers = [];
var map;

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
function clearOverlays() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

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
function initMap() {

  var mapOptions = {

    zoom: 14,
    center: {
      lat: 49.249889599999996,
      lng: -123.00167519999998
    },

    styles: [{
        elementType: 'geometry',
        stylers: [{
          color: '#242f3e'
        }]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#242f3e'
        }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#c48b31'
        }]
      },
      {
        featureType: 'poi',
        stylers: [{
          "visibility": "off"
        }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text',
        stylers: [{
          "visibility": "off"
        }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{
          "visibility": "on"
        }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{
          color: '#1e3c40'
        }]
      },

      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
          color: '#38414e'
        }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#212a37'
        }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#f2f2f2'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
          color: '#746855'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#1f2835'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#edc07a'
        }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
          color: '#3b485b'
        }]
      },
      {
        featureType: 'transit.station',
        stylers: [{
          "visibility": "off"
        }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: '#385b60'
        }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text',
        stylers: [{
          "visibility": "off"
        }]
      }
    ]
  };

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

}

setInterval(loop, 1000);
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
function loop() {

  var Httpreq = new XMLHttpRequest();

  Httpreq.open("GET", "http://159.89.115.34/data?password=dc4985", false);
  Httpreq.send(null);

  json = JSON.parse(Httpreq.responseText);

  setMapOnAll(null);
  markers = [];

  for (i in json) {
    for (j in json[i]) {

      var t = json[i][j];

      x = t.x;
      y = t.y;
      userName = t.name;
      var title = '' + t.ip.substring(7) + ' ' + userName;
      console.log("name: " + userName + " (" + x + "," + y + ")");

      var marker = new google.maps.Marker({
        position: {
          lat: parseInt(x),
          lng: parseInt(y)
        },
        map: map,
        label: {
          color: 'white',
          fontWeight: 'bold',
          text: title
        },
        icon: {
          labelOrigin: new google.maps.Point(15, 50),
          url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
          size: new google.maps.Size(30, 40),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(15, 40),
        }
      });

      markers.push(marker);

      var lat_lon = new google.maps.LatLng(x, y); // mac_49.249889599999996_-123.00167519999998_
      marker.setPosition(lat_lon);

    }
  }

  setMapOnAll(map);
}

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
// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
