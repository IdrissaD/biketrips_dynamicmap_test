// PISTES TRAVAIL :
// Stocker var length dans une propriété (créer propriété ds objets GeojSon ? Créér tableau identifiant/length ?) Sans ça pas de resetStyle possible
// Abandonner le un sur deux et refaire analyse spatiale de chaque split pr ajouter sa longueur au bon département. Devrait éliminer problème Lyon-Trets
// Régler problème de l'Aude et de Port-la-Nouvelle - Narbonne

var osm_layer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {

	attribution: '<a href = "https://areskidrissa.cc" target = "_blank">areskidrissa.cc</a> Map data &copy; <a href="https://www.openstreetmap.org/" target = "_blank">OpenStreetMap</a> contributors, ' +

	'<a href="https://creativecommons.org/licenses/by-sa/2.0/" target = "_blank">CC-BY-SA</a>'
});

var choromap = L.map('choroid').setView([45.757523270000576, 4.831581115722656], 6);

// Define color scale according to length
function style_dpts(feature) {
    return {
        opacity: 1,
        fillOpacity: 0.2,
        fillColor: getColor(length)
    }
};


function onEachFeature(feature, layer) {
    layer.bindPopup('<p><b>' + feature.properties.nom + '</b></p><p>'+ parseFloat(length).toFixed(0) + ' km</p>');
    /*layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });*/
};

var dpts_layer = L.geoJSON(null, {
    onEachFeature: onEachFeature,
    style: style_dpts
});

/*function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: 'green',
        opacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
};

function resetHighlight(e) {
    dpts_layer.resetStyle(e.target);
};*/

var length = 0

/*test = turf.lineSplit(routes.features[3], dpts.features[20]);
console.log(test.length);
if (test.length == undefined)
	{ console.log("YES")}*/

// Loop over dpts and routes
for (dpt of dpts.features) {
	var length = 0
	for (route of routes.features) {
		/*intersect_length = turf.lineIntersect(route, dpt).length;
		coords = turf.getCoords(route.geometry.coordinates[0]);
		coords2 = turf.getCoords(coords);
		turf.point(coords2);
		first_point_contained = turf.booleanPointInPolygon(turf.point(coords), dpt);
	if (intersect_length == undefined && first_point_contained == TRUE) {
		length = turf.length(route)
	}*/
	// take each set of coords
	route.geometry.coordinates.forEach(part => {
		// split the line against the geom of the dpt
		let split = turf.lineSplit(turf.lineString(part), dpt);
		//console.log(split.features);
		/*let oddPair;
		// check if the first point of the spliced line is in the dpt

		if(turf.booleanPointInPolygon(turf.point(part[0]), dpt)){
			oddPair = 0;
		} else {
			oddPair = 1;
		}*/
		// try to check if the route is contained in the dpt, in which case length = full length of the route
		if (turf.booleanPointInPolygon(turf.point(part[0]), dpt) && split.features.length == 0) {
				length = turf.length(route);
				//console.log(length);
			}
		// only get the length of 1 out of 2 segments of each route (a segment contained in a dpt has to be surrounded by two segments not contained)
		split.features.forEach((splitedPart, i) => {
			//console.log(i+oddPair);
			// JE PRENDS UN POINT DE CHAQUE SPLITED PART, ICI LE DEUXIEME CAR LE PREMIER EST FORCEMENT DANS LE DEPARTEMENT EN TANT QUE POINT D'INTERSECTION
            // ET SI CE DEUXIEME POINT EST DANS LE DPT, ALORS J'AFFICHE LE SEGMENT SUR LA CARTE ET J'AJOUTE SA LONGUEUR AU DPT

            if (turf.booleanPointInPolygon(turf.point(splitedPart.geometry.coordinates[1]), dpt)) {
				L.geoJSON(splitedPart.geometry, {style: function(feature){return{color: '#'+(Math.random()*0xFFFFFF<<0).toString(16)}}}).addTo(choromap);
                console.log(splitedPart);
				length = length + turf.length(splitedPart);}
				//console.log(length);
		});
	})}
	dpts_layer.addData(dpt) 
};
       
// Define the colors for the legend
function getColor(d) {
    return d > 250  ? 'rgba(0,68,27,1.0)' :
           d > 200  ? 'rgba(29,134,65,1.0)' :
           d > 150  ? 'rgba(84,181,103,1.0)' :
           d > 100   ? 'rgba(158,216,152,1.0)' :
           d > 50   ? 'rgba(213,239,207,1.0)' :
           d > 0   ? 'rgba(247,252,245,1.0)' :
           'rgba(255,255,255,0.0)';
}

// Crate a legend control
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 50, 100, 150, 200, 250],
        labels = [];

    div.innerHTML = '<p><b>Nombre de kilomètres<br>parcourus dans<br> le département</b></p>'

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

dpts_layer.addTo(choromap);
osm_layer.addTo(choromap);
legend.addTo(choromap);