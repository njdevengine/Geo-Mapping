//Center our Leaflet map and set zoom level, we are visualizing a month of
//Earthquakes around the globe so we should zoom out to see the earth.
var month_data =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var eq_map = L.map("map", {
  center: [39.8097, -98.5556],
  zoom: 3
});

L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 30,

    id: "mapbox.dark",

    accessToken: API_KEY
  }
).addTo(eq_map);

function markers_size(magnitude) {
  return magnitude * 30000;
}

function Color_Selector(magnitude) {
  if (magnitude > 5) {
    return "#ffff00";
  } else if (magnitude >= 4 && magnitude <= 5) {
    return "#eeff41";
  } else if (magnitude >= 3 && magnitude <= 4) {
    return "#b2ff59";
  } else if (magnitude >= 2 && magnitude <= 3) {
    return "#69f0ae";
  } else if (magnitude >= 1 && magnitude <= 2) {
    return "#64ffda";
  } else if (magnitude >= 0 && magnitude <= 1) {
    return "#18ffff";
  } else {
    return "#fafafa";
  }
}

d3.json(month_data, function(d) {
  let eq_json_data = d.features;

  let eq_name_array = [];
  eq_json_data.forEach(function(d) {
    let title = d.properties.title;
    eq_name_array.push(title);
  });

  // Loop through earthquake json generating circles scaled and colored by magnitude
  for (var i = 0; i < eq_json_data.length; i++) {
    L.circle(
      [
        eq_json_data[i].geometry.coordinates[1],
        eq_json_data[i].geometry.coordinates[0]
      ],
      {
        fillOpacity: 0.4,
        color: "#404040",
        weight: 0,
        // Color Determined by Magnitude
        fillColor: Color_Selector(eq_json_data[i].properties.mag),
        radius: markers_size(eq_json_data[i].properties.mag)
      }
    )
    //Attach popup to clicked objects
      .bindPopup(
        "<div><center><strong>Location:</strong> " +
          eq_name_array[i] +
          "</center></div><hr><div><center><strong> Magnitude:</strong> " +
          eq_json_data[i].properties.mag +
          "</center></div>" +
          "<hr><div><center><strong> EQ Time:</strong> " +
          time(eq_json_data[i].properties.time) +
          "</center></div>"
      )
      .addTo(eq_map);
  }
});

//Convert Unix timestamp to a more standard time format
function time(s) {
  return new Date(s * 1e3).toISOString().slice(-13, -5);
}
