(function () {
  L.mapbox.accessToken = 'pk.eyJ1IjoicGFyYW1pdGEiLCJhIjoiY2lwZDB1b2ZqMDAzeXZrbm4yc2Q2MDI3bCJ9.Smdc7nIE31AkUlaKzeeRGQ';
  var map = L.mapbox.map(document.getElementById('map'), 'mapbox.outdoors', {
    // accessToken: 'pk.eyJ1IjoicGFyYW1pdGEiLCJhIjoiY2lwZDB1b2ZqMDAzeXZrbm4yc2Q2MDI3bCJ9.Smdc7nIE31AkUlaKzeeRGQ',
    center: [52.6, 24],
    zoom: 10,
    scrollWheelZoom: false
  });
  var form = $('form.map-controls');
  var wolves = [];

  $.get('/api/locations', function(res) {
    wolves = res;
    updateMap();
    form.on('change', updateMap);
  });

  function updateMap() {

    var filter = form.serializeArray().reduce(function (filter, el) {
      filter[el.name] = el.value;
      return filter;
    }, {});

    if (filter.limit) { filter.limit = new Date().setMonth(new Date().getMonth() - filter.limit) }

    wolves.forEach(function (wolf) {

      if (wolf.layer) { wolf.layer.clearLayers() }
      if (!filter[wolf.name]) { return; }

      var path = [];
      var json = {
        type: 'FeatureCollection',
        features: []
      };

      switch (filter.mode) {
        case 'path':

          wolf.locations.forEach(function (loc) {
            if (!filter.limit || loc.date > filter.limit) {
              if (loc.marker) {
                json.features.push({
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: loc.latlng
                  },
                  properties: {
                    title: loc.title,
                    date: loc.date,
                    url: loc.url,
                    'marker-color': wolf.color
                  }
                });
              }

              path.push(loc.latlng);
            }
          });

          json.features.push({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: path
            },
            properties: {
              stroke: wolf.color
            }
          });
          break;

        case 'area':
          json.features.push({
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [wolf.habitat]
            },
            properties: {
              stroke: wolf.color,
              fill: wolf.color
            }
          });
          break;
      }

      if (!wolf.layer) {
        wolf.layer = L.mapbox.featureLayer().addTo(map);
        wolf.layer.on('layeradd', function (e) {
          if (e.layer.feature.geometry.type !== 'Point') { return; }
          e.layer.bindPopup(
            '<img src="' + wolf.avatar + '"/>' +
            '<a href="' + e.layer.feature.properties.url + '">' + e.layer.feature.properties.title + '</a>'
          );
        })
      }

      wolf.layer.setGeoJSON(json);

    });

  }

})();
