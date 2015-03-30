require([
  'esri/map',
  'esri/layers/FeatureLayer',
  'widgets/AutoComplete',
  'dojo/domReady!'
], function(
  Map, FeatureLayer,
  AutoComplete
) {
  var map = new Map('map', {
    basemap: 'topo',
    center: [-118.238, 34.083],
    zoom: 13
  });

  var layer = new FeatureLayer('http://services2.arcgis.com/j80Jz20at6Bi0thr/arcgis/rest/services/Parks/FeatureServer/0', {
    id: 'parks',
    outFields: ['*'],
    mode: FeatureLayer.MODE_SNAPSHOT
  });

  map.addLayers([layer]);

  map.on('load', function () {
    var complete = new AutoComplete({ map: map, layer: layer }, 'autocomplete');
  });
});
