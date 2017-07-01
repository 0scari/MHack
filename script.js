/**
 * Created by oscar on 17/06/2017.
 */
// document.getElementById("distanceOutput").value = computeTotalDistance(response).toFixed(2) + " km";
var map;
var marker;
var markers = [];


function initMap() {

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay1 = new google.maps.DirectionsRenderer({draggable: true});
    var directionsDisplay2 = new google.maps.DirectionsRenderer({draggable: true});
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        center: {lat: 56.953748, lng: 24.195647}
    });
    directionsDisplay1.setMap(map);
    directionsDisplay2.setMap(map);
    directionsDisplay1.setPanel(document.getElementById('directions-panel'));


    // directionsDisplay1.addListener('directions_changed', function() {
    //     // Output the actual distance estimate after markers are moved
    //     document.getElementById("distanceOutput").value = computeTotalDistance(directionsDisplay1.getDirections()).toFixed(2) + " km";
    // });

    map.addListener('click', function(event) {
        /* On click calculate the coordinates for i amount of waypoints, whose coordinates are aligned
         * in a circular pattern, and output requested directions based on them.
         */
        var distance = document.getElementById("distance").value;
        distance = (distance / 8) * 1000;

        var directionsResponse1 = null;
        var i1Markers       = [];
        var i2Markers       = [];

        var start = {lat: event.latLng.lat(), lng: event.latLng.lng()};
        var spherical = google.maps.geometry.spherical;

        // markers.push(prepareMarker(moveNorth(start, distance, spherical)));
        // prepareMarker(getOriginOfR1(start, distance, spherical))

        var myCallback = function (latLng, degrees) {
            latLng = new google.maps.LatLng(latLng.lat, latLng.lng);
            var west = spherical.computeOffset(latLng, distance , degrees);
            return {lat: west.lat(), lng: west.lng()};
        };
        var getDirections = function (markers1, markers2) {

            var request1 = fillStopovers(markers1);
            var request2 = fillStopovers(markers2);

            function requestAsync(request) {

                return new Promise(function(resolve, reject) {
                    directionsService.route(request, function(response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            //directionsDisplay1.setDirections(response);
                            return resolve(response)
                        } else { return reject("couldn't get directions:"+status);}
                    });
                });
            }

            Promise.all([requestAsync(request1), requestAsync(request2)])
                .then(function(responses) {
                     directionsDisplay1.setDirections(responses[0]);
                     directionsDisplay2.setDirections(responses[1]);
                     console.log(responses[0]);
                     console.log(responses[1]);


                });

        };

        var itinerary1 = calcR1coords(start, myCallback);
        var itinerary2 = calcR2coords(start, myCallback);

        i1Markers = prepareMarkers(itinerary1);
        i2Markers = prepareMarkers(itinerary2);

        getDirections(i1Markers, i2Markers);


        //prepareDirections(request, directionsService, directionsDisplay1);

    });
}

function fillStopovers(markers) {
    var request = {
        travelMode: google.maps.TravelMode.WALKING,
        //optimizeWaypoints: true,
        avoidHighways: true
    };

    request.waypoints   = [];
    request.origin      = markers[0].getPosition();
    request.destination = markers[markers.length -1].getPosition();

    for (var i = 1; i < markers.length - 1; i++) {
        request.waypoints.push({
            location: markers[i].getPosition(),
            stopover:true
        })
    }

    return request;
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
function getOriginOfR1(veryStart, callback) {
    var north1  = moveNorth(veryStart, callback);
    var west1   = moveWest(north1, callback);
    return moveNorth(west1, callback);
}
function getOriginOfR2(veryStart, callback) {
    var east1 = moveEast(veryStart, callback);
    var east2 = moveEast(east1, callback);
    return moveNorth(east2, callback);
}
function calcR1coords(start, callback) {
    var itinerary = [];
    itinerary.push(getOriginOfR1(start, callback));
    itinerary.push(moveWest(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveSouth(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveEast(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveNorth(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveEast(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveSouth(itinerary[itinerary.length - 1], callback));   // 6
    itinerary.push(moveWest(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveSouth(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveEast(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveNorth(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveEast(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveNorth(itinerary[itinerary.length - 1], callback)); // 12
    itinerary.push(moveWest(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveEast(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveEast(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveSouth(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveWest(itinerary[itinerary.length - 1], callback)); // 17
    itinerary.push(moveSouth(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveWest(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveSouth(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveWest(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveNorth(itinerary[itinerary.length - 1], callback)); // 22
    itinerary.push(moveWest(itinerary[itinerary.length - 1], callback));
    itinerary.push(moveNorth(itinerary[itinerary.length - 1], callback));
    return itinerary;
}
function calcR2coords(start, callback) {
    var itinerary = [];
    itinerary.push(getOriginOfR2(start, callback));
    itinerary.push(moveSouth(itinerary[itinerary.length-1], callback));
    itinerary.push(moveWest(itinerary[itinerary.length-1], callback));
    itinerary.push(moveSouth(itinerary[itinerary.length-1], callback));
    itinerary.push(moveEast(itinerary[itinerary.length-1], callback));
    itinerary.push(moveNorth(itinerary[itinerary.length-1], callback));    // 5
    itinerary.push(moveSouth(itinerary[itinerary.length-1], callback));
    itinerary.push(moveSouth(itinerary[itinerary.length-1], callback));
    itinerary.push(moveWest(itinerary[itinerary.length-1], callback));
    itinerary.push(moveNorth(itinerary[itinerary.length-1], callback));
    itinerary.push(moveWest(itinerary[itinerary.length-1], callback));     // 10
    itinerary.push(moveSouth(itinerary[itinerary.length-1], callback));
    itinerary.push(moveEast(itinerary[itinerary.length-1], callback));
    itinerary.push(moveWest(itinerary[itinerary.length-1], callback));
    itinerary.push(moveWest(itinerary[itinerary.length-1], callback));
    itinerary.push(moveWest(itinerary[itinerary.length-1], callback));     // 15
    itinerary.push(moveNorth(itinerary[itinerary.length-1], callback));
    itinerary.push(moveNorth(itinerary[itinerary.length-1], callback));
    itinerary.push(moveSouth(itinerary[itinerary.length-1], callback));
    itinerary.push(moveEast(itinerary[itinerary.length-1], callback));
    itinerary.push(moveSouth(itinerary[itinerary.length-1], callback));    // 20

    return itinerary;

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
function prepareMarkers (itinerary) {
    var markers = [];
    for (var i = 0; i < itinerary.length; i++) {
        markers.push(prepareMarker(itinerary[i]));
    }
    return markers;
}

function toRadians(number) {
    return number * Math.PI / 180;
}

function toDegrees(number) {
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

