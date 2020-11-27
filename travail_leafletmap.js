var osm_layer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {

	attribution: '<a href = "https://areskidrissa.cc" target = "_blank">areskidrissa.cc</a> Map data &copy; <a href="https://www.openstreetmap.org/" target = "_blank">OpenStreetMap</a> contributors, ' +

	'<a href="https://creativecommons.org/licenses/by-sa/2.0/" target = "_blank">CC-BY-SA</a>'

	});


var mymap = L.map('mapid').setView([49.49544809215964, 4.9706268310546875], 5);

osm_layer.addTo(mymap);

var style = function(geo) {
    return {color: "green"}
};

var onEachFeature = function(feature,layer) {
    layer.bindPopup('<p><b>' + feature.properties.name + '</b></p><p>'+ parseFloat(turf.length(feature.geometry, {units: 'kilometers'})).toFixed(0) + ' km</p>')
};

var routesLayer = L.geoJson(routes, {
        onEachFeature: onEachFeature,
        style: style
    });


/*var list_files = [
"http://localhost:8000\/data\/Lyon - Yvoire.gpx"];

//console.log(list_files);

for (var i = 0; i< list_files.length; i+= 1) {
    extension = list_files[i].split('.').pop()
    
    if (extension == 'kml') {
        omnivore.kml(list_files[i], null, customLayer).addTo(mymap)}

    else if (extension == 'gpx') {
        omnivore.gpx(list_files[i], null, customLayer).addTo(mymap)}

    else if (extension == 'geojson') {
        omnivore.geojson(list_files[i], null, customLayer).addTo(mymap)}
};*/

var titre = L.control({position: 'topright'});

titre.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'titre'); // create a div with a class "info"
    div.innerHTML = '<h4>Tracés de mes voyages à vélo</h4>';
    return div;
};

routesLayer.addTo(mymap);
titre.addTo(mymap);