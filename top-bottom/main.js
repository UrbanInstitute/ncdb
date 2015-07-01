

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! START OF FUNCTIONS FOR TIM TO WRITE !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function drawMap() {

  var coords = [42, -94];

//  if (currentState.lat !== null && currentState.lon !== null) {
//    coords = [currentState.lat, currentState.lon];
//  }

    var map = L.mapbox.map('map2', 'urbaninstitute.7438ce9f,', {
      fadeAnimation: true,
      maxZoom: 12,
      minZoom: 3,
      attributionControl: false
    })
    .setView(coords, 7);

  L.mapbox.accessToken = (
    'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ'
  );
  var hash = L.hash(map);


  var last_layer;

  function init(id) {
    var tile = L.mapbox.tileLayer(id, {
      unloadInvisibleTiles: true
    });
    return tile;
  }

   var layers = [{
        name: '1990',
       layer: init('urbaninstitute.tqmbcsor'), //1990
        grid: L.mapbox.gridLayer('urbaninstitute.tqmbcsor')
       
//        layer: init('urbaninstitute.ncdb-top-bot'), //2010
//        grid: L.mapbox.gridLayer('urbaninstitute.ncdb-top-bot')
    },{
        name: '2000',
        layer: init('urbaninstitute.u4xqolxr'), //2000
        grid: L.mapbox.gridLayer('urbaninstitute.u4xqolxr')
    },{
        name: '2010',
         layer: init('urbaninstitute.ncdb-top-bot'), //2010
        grid: L.mapbox.gridLayer('urbaninstitute.ncdb-top-bot')
    } ];


  var control = document.getElementById('layers');

  layers.forEach(function(layer, n) {
    layer.button = control.appendChild(document.createElement('a'));
    layer.button.innerHTML = layers[n].name;
    layer.button.onclick = function() {
      highlightLayer(n);
    };
   });

  // we use a layer group to make it simple to remove an existing overlay
  // and add a new one in the same line of code, as below, without juggling
  // temporary variables.
  var layerGroup = L.layerGroup().addTo(map);

  // i is the number of the currently-selected layer: this loops through
  // 0, 1, and 2.
  highlightLayer(2);

  // var active;
  function highlightLayer(i) {
    i = i % 3;
//    if (i === 0) {
      layerGroup.clearLayers();
//    }
    layerGroup.addLayer(layers[i].layer);
    var gridControl = L.mapbox.gridControl(layers[i].grid);
    map.addLayer(layers[i].grid);

    var count = document.getElementById('count');

    var active = control.getElementsByClassName('active');

    for (var j = 0; j < active.length; j++) active[j].className = '';
    layers[i].button.className = 'active';

  }

  //streets on top
  var streetLayer = L.mapbox.tileLayer('urbaninstitute.h5b1kc2b');
  streetLayer
    .setZIndex(100)
    .addTo(map);

 
}



// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! END OF FUNCTIONS FOR TIM TO WRITE !!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// draw map on document load
$(drawMap);