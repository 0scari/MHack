/**
 * Created by oscar on 17/06/2017.
 */
var map;
var marker;
var myLatLng ={};
var markers = [];


function initMap() {
    

    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('floating-panel')
    });
    // Create a map and center it on Ilukstes iela, Riga
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 56.953748, lng: 24.195647},
        zoom: 14
    });
    directionsDisplay.setMap(map);

    var infowindow = new google.maps.InfoWindow();
    var request = {
          travelMode: google.maps.TravelMode.WALKING,
          optimizeWaypoints: true
    };


    directionsDisplay.addListener('directions_changed', function() {
        document.getElementById("currDist").value = computeTotalDistance(directionsDisplay.getDirections()).toFixed(2) + " km";
    });

    map.addListener('click', function(event) {

        var lat1 = event.latLng.lat();
        var lng1 = event.latLng.lng();

        var distance =  document.getElementById("distance").value;
        var apl_radius = distance/6.28*1000;
        var i = 0;
        var gradi = 0; // to position the middle of the circle straight above the geoloc of the clicked place
        var centrs = rhumbDestinationPoint(lat1, lng1, apl_radius, gradi);
        gradi = 180; //make the 1st marker be the at point straight below the middle of the circle
        markers = [];

        request.waypoints = [];


        for(i; i < 4; i++)
        {
            coord = rhumbDestinationPoint(centrs.lat, centrs.lng, apl_radius, gradi);
            gradi = gradi + 90;

            markers.push(uzzimetMarkieri(coord));


            if(i == 0)
            {
              request.origin = markers[i].getPosition();
            }
            else if(i == 3)
            {
              request.destination = markers[0].getPosition();
              request.waypoints.push({
                location: markers[i].getPosition(),
                stopover:true
              });
              console.log("symbian");
            }
            else{
              if(!request.waypoints){
                request.waypoints = [];
              }else{
                request.waypoints.push({
                  location: markers[i].getPosition(),
                  stopover:true
                });
              }
            }
        }

        var distance = 0;
        // Instantiate a directions service.
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
              document.getElementById("currDist").value = computeTotalDistance(response).toFixed(2) + " km";
          } else { alert("couldn't get directions:"+status);}
        });



    });
}

function iegutDistanci(){
  var geocoder = new google.maps.Geocoder;
  var service  = new google.maps.DistanceMatrixService;
  var originList = response.originAddresses;

  geocoder.geocode({'address': originList[i]},
      showGeocodedAddressOnMap(false));
}

function uzzimetMarkieri (cord){
  myLatLng = {lat: coord.lat, lng: coord.lng};
  marker = new google.maps.Marker({
      position: myLatLng,
      //map: map
  });
  return marker;
}

function rhumbDestinationPoint(lat1, lng1, distance, bearing)
{
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

function getRoute()
{
    return false;
}

function removeMarkers(){
    for(var i=0; i<markers.length; i++){
        markers[i].setMap(null);
    }
}

function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (var i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    return total / 1000;
}

// document.getElementById('distance').value
