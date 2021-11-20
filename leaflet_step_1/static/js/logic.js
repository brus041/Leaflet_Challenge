var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(url).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);

  });
  

  function createFeatures(earthquakeData) {
  
    var dt = earthquakeData

    createMap(dt);
  }
 
  function createMap(dt) {
      console.log(dt)
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
    // var overlayMaps = {
    //   Earthquakes: earthquakes
    // };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      
      layers: [street]
    });
  
    // create circle thingies in here
    for (var i = 0; i < dt.length; i++) {
        var long = dt[i].geometry.coordinates[0];
        var lat = dt[i].geometry.coordinates[1];
        var color_value = dt[i].geometry.coordinates[2];
        var mg = dt[i].properties.mag

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
            color: 'black',
            fillColor: cl,
            radius: 15000*mg,
          }).bindPopup(`<h3>${dt[i].properties.place}</h3><hr><p>${new Date(dt[i].properties.time)}</p>
          <p>Coordinates: ${long} and ${lat}</p> <p>Maginitude: ${mg}</p><p>Depth: ${color_value}</p>`).addTo(myMap)
        }
    
//create legend 
function getColor(c){
    if (c >=-10 & c < 10){
        return 'violet';
    }
    else if  (c >=10 & c < 30){
        return'blue';
    }
    else if (c >=30 & c < 50){
       return 'green';
    }
    else if (c >=50 & c< 70){
       return'gold';
    }
    else if (c >=70 & c < 90){
        return 'orange';
    }
    else if (c >=90){
        return 'red';
    }
}
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90]

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

    L.control.layers(baseMaps, {
      collapsed: false
    }).addTo(myMap);
  
}
  // create a circle marker for each feature in the data 
  // location of cirlce marker is (data.geometry.coordinates[0],data.geometry.coordinates[1])
  // color of circle is data.geometry.coordinates[2]
  // size of circle marker is data.features.properties.mag