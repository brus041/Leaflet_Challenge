var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
    console.log(data.features);
  });
  

  function createFeatures(earthquakeData) {
  
    // Define a function that we want to run once for each feature in the features array.
    // // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature,layer) {
       layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
      
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature
    });
  
    // Send our earthquakes layer to the createMap function/
    var dt = earthquakeData

    createMap(earthquakes,dt);
  }
 
  function createMap(earthquakes,dt) {
    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    var baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [street, earthquakes]
    });
  
    // create circle thingies in here
    for (var i = 0; i < dt.length; i++) {
        var long = dt[i].geometry.coordinates[0];
        var lat = dt[i].geometry.coordinates[1];
        var color_value = dt[i].geometry.coordinates[2];

        if (color_value >=-10 & color_value < 10){
            var cl = 'violet';
        }
        else if  (color_value >=10 & color_value < 30){
            var cl = 'blue';
        }
        else if (color_value >=30 & color_value < 50){
            var cl = 'green';
        }
        else if (color_value >=50 & color_value < 70){
            var cl = 'gold';
        }
        else if (color_value >=70 & color_value < 90){
            var cl = 'orange';
        }
        else if (color_value >=90){
            var cl = 'red';
        }
        var circle = L.circle([lat,long], {
            fillOpacity: 1.0,
            color: cl,
            radius: 20000*dt[i].properties.mag,
          }).addTo(myMap)
        }
    

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' +  + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(myMap);

    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
}
  // create a circle marker for each feature in the data 
  // location of cirlce marker is (data.geometry.coordinates[0],data.geometry.coordinates[1])
  // color of circle is data.geometry.coordinates[2]
  // size of circle marker is data.features.properties.mag