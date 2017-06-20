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

    var request = {
          travelMode: google.maps.TravelMode.WALKING,
          optimizeWaypoints: true
    };


    directionsDisplay.addListener('directions_changed', function() {
        // Output the actual distance estimate after markers are moved
        document.getElementById("distanceOutput").value = computeTotalDistance(directionsDisplay.getDirections()).toFixed(2) + " km";
    });

    map.addListener('click', function(event) {
        /* On click calculate the coordinates for i amount of waypoints, whose coordinates are aligned
         * in a circular pattern, and output requested directions based on them.
         */

        var center = rhumbDestinationPoint(event.latLng.lat(), event.latLng.lng());

        markers           = [];
        request.waypoints = [];

        var bearing = 180;
        var startAndFinishMarker  = prepareMarker(rhumbDestinationPoint(center.lat, center.lng, bearing));
        request.origin      = startAndFinishMarker.getPosition();
        request.destination = startAndFinishMarker.getPosition();
        markers.push(startAndFinishMarker);

        var coords;

        for(var i = 1; i < 4; i++)
        {
            bearing += 90;
            coords = rhumbDestinationPoint(center.lat, center.lng, bearing);

            markers.push(prepareMarker(coords));
            request.waypoints.push({
                location: markers[i].getPosition(),
                stopover:true
            });
        }

        prepareDirections(request, directionsService, directionsDisplay);

    });
}



function prepareDirections(request, directionsService, directionsDisplay) {
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            document.getElementById("distanceOutput").value = computeTotalDistance(response).toFixed(2) + " km";
        } else { alert("couldn't get directions:"+status);}
    });
}

function prepareMarker (coords){
  marker = new google.maps.Marker({
      position: coords,
      //map: map
  });
  return marker;
}

/**
 *      Given a start point, initial bearing, and distance, this will calculate the destination point
 *      and final bearing travelling along a (shortest distance) great circle arc.
 *
 *  Formula:
 *  φ2 = asin( sin φ1 ⋅ cos δ + cos φ1 ⋅ sin δ ⋅ cos θ )
 *  λ2 = λ1 + atan2( sin θ ⋅ sin δ ⋅ cos φ1, cos δ − sin φ1 ⋅ sin φ2 )
 *  where	φ is latitude, λ is longitude, θ is the bearing (clockwise from north),
 *  δ is the angular distance d/R; d being the distance travelled, R the earth’s radius
 *
 *  http://www.movable-type.co.uk/scripts/latlong.html                     (explanation)
 *  http://cdn.rawgit.com/chrisveness/geodesy/v1.1.1/latlon-spherical.js   (source)
 *
 * @param lat1
 * @param lng1
 * @param bearing
 * @returns {{lat: *, lng: *}}
 */
function rhumbDestinationPoint(lat1, lng1, bearing = 0)
{
    var distance = document.getElementById("distance").value;
    distance = distance/6.28*1000;

    var radius = 6371000;
    var δ = Number(distance) / radius; // angular distance in radians

    var φ1 = toRadians(lat1), λ1 = toRadians(lng1);
    var θ = toRadians(bearing);
    var Δφ = δ * Math.cos(θ);
    var φ2 = φ1 + Δφ;

    // check for some daft bugger going past the pole, normalise latitude if so
    if (Math.abs(φ2) > Math.PI/2) φ2 = φ2>0 ? Math.PI-φ2 : -Math.PI-φ2;
    var Δψ = Math.log(Math.tan(φ2/2+Math.PI/4)/Math.tan(φ1/2+Math.PI/4));

    var q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1);

    var Δλ = δ*Math.sin(θ)/q;
    var λ2 = λ1 + Δλ;

    φ2 = toDegrees(φ2);
    λ2 = (toDegrees(λ2)+540) % 360 - 180;

    return {lat: φ2, lng: λ2};
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

