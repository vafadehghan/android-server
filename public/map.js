var x = 0;
var y = 0;
var name;

var markers = [];
var map;

function clearOverlays() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

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

function loop() {

  var Httpreq = new XMLHttpRequest();

  Httpreq.open("GET", "http://159.89.115.34/data?password=dc4985", false);
  Httpreq.send(null);

  json = JSON.parse(Httpreq.responseText);

  deleteMarkers();

  for (i in json) {
    for (j in json[i]) {

      var t = json[i][j];

      x = t.x;
      y = t.y;
      name = t.name;
      var title = '' + t.ip.substring(7) +' ' + name;
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

      var lat_lon = new google.maps.LatLng(x, y); // mac_49.249889599999996_-123.00167519999998_
      marker.setPosition(lat_lon);

    }
  }

  setMapOnAll(map);
  showMarkers();

}


// GMAPS TOOLS

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}
