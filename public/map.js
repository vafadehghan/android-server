/*---------------------------------------------------------------------------------------
--	SOURCE FILE: map.js - This file will deal with drawing and removing map markers
--
--	PROGRAM:     Location Finder
--
--	DATE:        April 5, 2018
--
--	FUNCTIONS:
--					function initMap()
--					function loop()
--          function setMapOnAll(map)
--
--
--	DESIGNERS:		Vafa Dehghan Saei
--
--	PROGRAMMERS:	Vafa Dehghan Saei
--
--
--	NOTES:
--  This script will show a map that is centered on BCIT.
--  The script will parse through the JSON file and display the markers on the map.
---------------------------------------------------------------------------------------*/
var x = 0;
var y = 0;
var name;
var markers = [];
var map;

/*----------------------------------------------------------------------
-- FUNCTION:	  initMap
--
-- DATE:        April 5, 2018
--
-- DESIGNER:    Vafa Dehghan Saei
--
-- PROGRAMMER:  Vafa Dehghan Saei
--
-- INTERFACE: 	function initMap()
--
-- ARGUMENT:    void
--
--
-- RETURNS:     void
--
-- NOTES:
-- This function is called first. It will zoom the map in on BCIT.
-- This funcion will also style the map.
----------------------------------------------------------------------*/
function initMap() {

  var mapOptions = {

    zoom: 14,
    center: {
      lat: 49.2498895,
      lng: -123.0016751
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
-- FUNCTION:	  loop
--
-- DATE:        April 5, 2018
--
-- DESIGNER:    Vafa Dehghan Saei
--
-- PROGRAMMER:  Vafa Dehghan Saei
--
-- INTERFACE: 	function loop()
--
-- ARGUMENT:    void
--
--
-- RETURNS:     void
--
-- NOTES:
-- This function is called every second and it will parse through the JSON file
-- and store the location and names of all connected clients and display them.
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
      name = t.name;
      var title = '' + t.ip.substring(7) + ' ' + name;
      console.log("name: " + name + " (" + x + "," + y + ")");

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

      var lat_lon = new google.maps.LatLng(x, y);
      marker.setPosition(lat_lon);

    }
  }
  setMapOnAll(map);

}

/*----------------------------------------------------------------------
-- FUNCTION:	  setMapOnAll
--
-- DATE:        April 5, 2018
--
-- DESIGNER:    Vafa Dehghan Saei
--
-- PROGRAMMER:  Vafa Dehghan Saei
--
-- INTERFACE: 	function setMapOnAll(map)
--
-- ARGUMENT:    map - an object to represent a map
--
--
-- RETURNS:     void
--
-- NOTES:
-- This function will go through all the markers and display them on the map.
----------------------------------------------------------------------*/
// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
