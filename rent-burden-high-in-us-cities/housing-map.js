$(document).ready(function() {

    //embed code
    $('input').val('<iframe src="http://datatools.metrotrends.org/charts/metrodata/_Features/maps/HAI/index.html" width="100%" height="550" frameborder="0" scrolling="no" style="border:none;border-style:none;"></iframe>').click(function() {
        $('input').select();
    });

    //        var map = L.mapbox.map('map', 'urbaninstitute.ddf7bf72,', {
    var map = L.mapbox.map('map2', ',', {
            fadeAnimation: true,
            maxZoom: 12,
            minZoom: 3,
            attributionControl: false
        })
        .setView([42, -94], 4);

    L.mapbox.accessToken = 'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ';
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
        layer: init('urbaninstitute.fsbp4x6r') //1990
    }, {
        name: '2000',
        layer: init('urbaninstitute.s31bgldi') //2000
    }, {
        name: '2010',
        layer: init('urbaninstitute.4251m7vi') //2010
    }];

    var control = document.getElementById('layers');


    var gridLayer = L.mapbox.gridLayer('urbaninstitute.tekrcnmi'); //1980
    map.addLayer(gridLayer);
    map.addControl(L.mapbox.gridControl(gridLayer));


    // Add a play button div
    var play_button = control.appendChild(document.createElement('a'))
    var pause = "&#9616;&#9616;";
    var play = "&#9654;";
    play_button.innerHTML = pause;
    play_button.id = "play_button";
    play_button.onclick = function() {
        if (nextInterval) {
            nextInterval = clearInterval(nextInterval);
            play_button.innerHTML = play;
        } else {
            highlightLayer(i++);
            if (i === 12) i = 0;
            nextInterval = animate();
            play_button.innerHTML = pause;
        }
    };

    layers.forEach(function(layer, n) {

        layer.button = control.appendChild(document.createElement('a'));
        layer.button.innerHTML = layers[n].name;
        layer.button.onclick = function() {
            layerGroup.clearLayers();
            highlightLayer(n);
            i = n;
            nextInterval = clearInterval(nextInterval);
            play_button.innerHTML = play;
        };
    });


    // we use a layer group to make it simple to remove an existing overlay
    // and add a new one in the same line of code, as below, without juggling
    // temporary variables.
    var layerGroup = L.layerGroup().addTo(map);

    // i is the number of the currently-selected layer: this loops through
    // 0, 1, and 2.
    var i = 0;

    // show the first overlay as soon as the map loads
    highlightLayer(i++);

    var nextInterval = animate();

    function animate() {
        // and then time the next() function to run every 1 seconds
        return setInterval(function() {
            highlightLayer(i);
            if (++i >= layers.length) i = 0;
        }, 3000 * 1);

    }

    function highlightLayer(i) {
        if (i == 0) {
            layerGroup.clearLayers();
        }
        layerGroup.addLayer(layers[i].layer);
        var active = control.getElementsByClassName('active');
        for (var j = 0; j < active.length; j++) active[j].className = '';
        layers[i].button.className = 'active';



    }


    //streets on top
    var streetLayer = L.mapbox.tileLayer('urbaninstitute.h5b1kc2b');
    streetLayer
        .setZIndex(100)
        .addTo(map);





});
