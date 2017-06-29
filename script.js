/**
 * Created by oscar on 17/06/2017.
 */

var map;
var marker;
var markers = [];


function initMap() {

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: 56.953748, lng: 24.195647}
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    var request = {
        travelMode: google.maps.TravelMode.WALKING,
        optimizeWaypoints: true,
        avoidHighways: true
    };


    // directionsDisplay.addListener('directions_changed', function() {
    //     // Output the actual distance estimate after markers are moved
    //     document.getElementById("distanceOutput").value = computeTotalDistance(directionsDisplay.getDirections()).toFixed(2) + " km";
    // });

    map.addListener('click', function(event) {
        /* On click calculate the coordinates for i amount of waypoints, whose coordinates are aligned
         * in a circular pattern, and output requested directions based on them.
         */
        var distance = document.getElementById("distance").value;
        distance = (distance / 8) * 1000;

        markers           = [];
        request.waypoints = [];

        var start = {lat: event.latLng.lat(), lng: event.latLng.lng()};
        var spherical = google.maps.geometry.spherical;

        // markers.push(prepareMarker(moveNorth(start, distance, spherical)));
        // prepareMarker(getOriginOfR1(start, distance, spherical))

        var myCallback = function (latLng, degrees) {
            latLng = new google.maps.LatLng(latLng.lat, latLng.lng);
            var west = spherical.computeOffset(latLng, distance , degrees);
            return {lat: west.lat(), lng: west.lng()};
        }

        prepareMarker(getOriginOfR1(start, myCallback));



        //prepareDirections(request, directionsService, directionsDisplay);

    });
}

function moveNorth(latLng, myCallback) {
    return myCallback(latLng, 0);
}

function moveSouth(latLng, myCallback) {
    return myCallback(latLng, 180);
}

function moveEast(latLng, myCallback) {
    return myCallback(latLng, 90);
}

function moveWest(latLng, myCallback) {
    return myCallback(latLng, -90);
}

function getOriginOfR1(veryStart, myCallback) {
    var north1  = moveNorth(veryStart, myCallback);
    var west1   = moveWest(north1, myCallback);
    return moveNorth(west1, myCallback);
}

function getDestinationOfR1() {

}


function prepareDirections(request, directionsService, directionsDisplay) {
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            console.log(response);
            document.getElementById("distanceOutput").value = computeTotalDistance(response).toFixed(2) + " km";
        } else { alert("couldn't get directions:"+status);}
    });
}

function prepareMarker (coords){

  marker = new google.maps.Marker({
      position: coords,
      map: map
  });
  return marker;
}



function toRadians(number)
{
    return number * Math.PI / 180;
}

function toDegrees(number)
{
    return number * 180 / Math.PI;
}

function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    return total / 1000;
}

