var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var geomap = L.map("map", {
    center: [39, -98.5795],
    zoom: 5
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors",
    maxZoom: 14
}).addTo(geomap);

d3.json(url).then(function(data){
    console.log(data);
    for (var i = 0; i < data.features.length; i++){
        var lat = data.features[i].geometry.coordinates[1];
        var lng = data.features[i].geometry.coordinates[0];

         // Check if coordinates are valid numbers
         if (!isNaN(lat) && !isNaN(lng)) {
            var coords = [lat, lng];
            // Rest of your code to create circle marker
        } else {
            console.error("Invalid coordinates:", lat, lng);

            // Determine color based on depth
            switch(true){
                case (depth > -10 && depth < 10):
                    color = 'rgb(19, 235, 45)';
                    break;
                case (depth >= 10 && depth < 30):
                    color = 'rgb(138, 206, 0)';
                    break;
                case (depth >= 30 && depth < 50):
                    color = 'rgb(186, 174, 0)';
                    break;
                case (depth >= 50 && depth < 70):
                    color = 'rgb(218, 136, 0)';
                    break;
                case (depth >= 70 && depth < 90):
                    color = 'rgb(237, 91, 0)';
                    break;
                case (depth >= 90):
                    color = 'rgb(242, 24, 31)';
                    break;
            }

            // Create circle marker only if coordinates are valid
            L.circle(coords, {
                opacity: .5,
                fillOpacity: 0.75,
                weight: .5,
                color: 'black',
                fillColor: color,
                radius: 7000 * data.features[i].properties.mag
            }).bindPopup(`<p align="left"><strong>Date:</strong> ${moment(data.features[i].properties.time).format('MMMM Do YYYY')}<br><strong>Time:</strong> ${moment(data.features[i].properties.time).format('h:mm:ss a')}<br><strong>Location:</strong> ${data.features[i].properties.place}<br><strong>Magnitude:</strong> ${data.features[i].properties.mag}</p>`).addTo(geomap);
        }
    }
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (){
    var div = L.DomUtil.create('div', 'info legend');
    var grades = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
    var colors = [
        'rgb(19, 235, 45)',
        'rgb(138, 206, 0)',
        'rgb(186, 174, 0)',
        'rgb(218, 136, 0)',
        'rgb(237, 91, 0)',
        'rgb(242, 24, 31)'
    ];
    var labels = [];
    grades.forEach(function(grade, index){
        labels.push("<div class='row'><li style=\"background-color: " + colors[index] + "; width: 20px; height: 15px\"></li>" + "<li>" + grade + "</li></div>");
    });

    div.innerHTML += "<ul>" + labels.join("") +"</ul>";
    return div;
};

legend.addTo(geomap);
