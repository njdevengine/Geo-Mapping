var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 5
});
L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }
).addTo(myMap);
const earthQuakeByDay_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
function markers_size(magnitude) {
  return magnitude * 18000;
}

d3.json(earthQuakeByDay_URL, function(d) {
  let earthQuake_Features = d.features;
  let earthQuake_name = [];
  earthQuake_Features.forEach(function(d) {
    let title = d.properties.title;
    earthQuake_name.push(title);
  });
  for (var i = 0; i < earthQuake_Features.length; i++) {
    L.circle(
      [
        earthQuake_Features[i].geometry.coordinates[1],
        earthQuake_Features[i].geometry.coordinates[0]
      ],
      {
        fillOpacity: 0.75,
        color: "#404040",
        weight: 0.5,
        fillColor: Color_Selector(earthQuake_Features[i].properties.mag),
        radius: markers_size(earthQuake_Features[i].properties.mag)
      }
    )
      .bindPopup(
        "<p><center><strong>Location:</strong> " +
          earthQuake_name[i] +
          "</center></p><hr><p><center><strong> Magnitude:</strong> " +
          earthQuake_Features[i].properties.mag +
          "</center></p>" +
          "<hr><p><center><strong>Incident Time:</strong> " +
          earthQuake_Features[i].properties.time +
          "</center></p>"
      )
      .addTo(myMap);
  }
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "info legend"),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        Color_Selector(grades[i] + 1) +
        '"></i> ' +
        grades[i] +
        (grades[i + 1] ? "-" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(myMap);
});
function Color_Selector(magnitude) {
  if (magnitude > 5) {
    return "#ff0000";
  } else if (magnitude >= 4 && magnitude <= 5) {
    return "#ff0000";
  } else if (magnitude >= 3 && magnitude <= 4) {
    return "#ffa500";
  } else if (magnitude >= 2 && magnitude <= 3) {
    return "#ffa500";
  } else if (magnitude >= 1 && magnitude <= 2) {
    return "#FFFF00";
  } else if (magnitude >= 0 && magnitude <= 1) {
    return "#00FF00";
  } else {
    return "#ffffff";
  }
}
