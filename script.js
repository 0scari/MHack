/**
 * Created by oscar on 17/06/2017.
 */
var map;
var marker;
var myLatLng ={};
var markers = [];

var lat1;
var lng1;

var gradi = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 56.853235, lng: 26.219458},
        zoom: 14
    });


    map.addListener('click', function(event) {

        lat1 = event.latLng.lat();
        lng1 = event.latLng.lng();

        allocMarkers();

    });

    // var myLatLng = {lat: 56.853235, lng: 26.219458};
    // var marker = new google.maps.Marker({
    //     position: myLatLng,
    //     map: map,
    //     title: 'Hello World!'
    // });

}

function allocMarkers(){

    removeMarkers();
    markers = [];

    var distance = document.getElementById("distance").value;

    var apl_radius = distance/6.28*1000;
    console.log(apl_radius);
    var i = 0;
    // var lat1 = 56.853235;
    // var lng1 = 26.219458;
    var cord = rhumbDestinationPoint(lat1, lng1, apl_radius, gradi);
    var centra_lat1 = coord.lat;
    var centra_lng1 = coord.lng;

    for(i; i< 10; i++){
        console.log(i);

        coord = rhumbDestinationPoint(centra_lat1, centra_lng1, apl_radius, gradi);



        gradi = gradi + 36;
        myLatLng = {lat: coord.lat, lng: coord.lng};
        marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            title: 'Hello World!',
            draggable:true
        });

        markers.push(marker);
    }
}


function rhumbDestinationPoint(lat1, lng1, distance, bearing)
{
    var radius = 6371000;
    var δ = Number(distance) / radius; // angular distance in radians

//console.log("lat1 = "+lat1);
//console.log("lng1 = "+lng1);
    var φ1 = toRadians(lat1), λ1 = toRadians(lng1);
//console.log("φ1 = "+ φ1);
//console.log("λ1 = "+ λ1);
    var θ = toRadians(bearing);
    var Δφ = δ * Math.cos(θ);
    var φ2 = φ1 + Δφ;
    console.log("φ2 = "+ φ2);

    // check for some daft bugger going past the pole, normalise latitude if so
    if (Math.abs(φ2) > Math.PI/2) φ2 = φ2>0 ? Math.PI-φ2 : -Math.PI-φ2;
    var Δψ = Math.log(Math.tan(φ2/2+Math.PI/4)/Math.tan(φ1/2+Math.PI/4));

    var q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1);

    var Δλ = δ*Math.sin(θ)/q;
    var λ2 = λ1 + Δλ;
    console.log("λ2 = "+ λ2);
    //LatLon(φ2.toDegrees(), (λ2.toDegrees()+540) % 360 - 180); // normalise to −180..+180°
    φ2 = toDegrees(φ2);
    λ2 = (toDegrees(λ2)+540) % 360 - 180;
    console.log("φ1 = "+ φ1);
    console.log("λ1 = "+ λ1);
    var cord = {lat: φ2, lng: λ2};
    return coord;
}

function toRadians(number)
{
    return number * Math.PI / 180;
}

function toDegrees(number)
{
    return number * 180 / Math.PI;
}

function getRoute() {
            // THE API CALL
}

function removeMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

    function incDist(){
        var elem =  document.getElementById("distance").value;
        document.getElementById("distance").value = Number(elem) + (Number(elem) * 0.1);

        elem =  document.getElementById("distance").value;
        document.getElementById("distance").value = Number(elem).toFixed(2);

        allocMarkers();



    }

    function decDist(){
        var elem =  document.getElementById("distance").value;
        document.getElementById("distance").value = Number(elem) - (Number(elem) * 0.1);

        elem =  document.getElementById("distance").value;
        document.getElementById("distance").value = Number(elem).toFixed(2);

        allocMarkers();
    }

    var x = 56.853235;
    var y = 26.219458;

    function rotate() {

        removeMarkers();
        markers = [];


            gradi += 20;

        var distance = document.getElementById("distance").value;

        var apl_radius = distance/6.28*1000;
        console.log(apl_radius);
        var i = 0;

        // var lat1 = 56.853235;
        // var lng1 = 26.219458;
        var cord = rhumbDestinationPoint(lat1, lng1, apl_radius, gradi);
        var centra_lat1 = coord.lat;
        var centra_lng1 = coord.lng;

        for(i; i< 10; i++){

            console.log(i);

            coord = rhumbDestinationPoint(centra_lat1, centra_lng1, apl_radius, gradi);



            gradi = gradi + 36;
            myLatLng = {lat: coord.lat, lng: coord.lng};
            marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Hello World!',
                draggable:true
            });

            markers.push(marker);
        }


    }

    


// document.getElementById('distance').value