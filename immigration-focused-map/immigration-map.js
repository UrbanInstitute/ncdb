$(function() {
    var initLat = 39.673;
    var initLon = -92.395;

    $("#embed").click(function() {
        $("#embed-modal").attr("style", "display:block;z-index:10;opacity:1;");
    });
    $(".close-modal").click(function() {
        $("#embed-modal").attr("style", "display:none;z-index:10;opacity:0;");
        $("#about-modal").attr("style", "display:none;z-index:10;opacity:0;");
    });

    $("#about").click(function() {
        $("#about-modal").attr("style", "display:block;z-index:10;opacity:1;");
    });

    $("#locBtn").click(getLocation);

    function getLocation() {
        var x = document.getElementById("locBtn");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
        console.log("getting location");
    }

    function showPosition(position) {
        map.panTo([position.coords.latitude, position.coords.longitude], 8);
    }

    var map = L.mapbox.map('map2', 'urbaninstitute.7438ce9f,', {
            fadeAnimation: true,
            maxZoom: 12,
            minZoom: 4,
            attributionControl: false
        })
        .setView([initLat, initLon], 5);
    //.setView([41.9023, -87.7080], 10);

    L.mapbox.accessToken = 'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ';
    //var hash = L.hash(map);

    var last_layer;

    function init(id) {
        var tile = L.mapbox.tileLayer(id, {
            unloadInvisibleTiles: true
        });

        return tile;
    }

    var layers = [{
        name: '1990',
        layer: init('urbaninstitute.4jazia4i'), //2010
        grid: L.mapbox.gridLayer('urbaninstitute.4jazia4i')

    },{
        name: '2000',
        layer: init('urbaninstitute.h564j9k9'), //2000
        grid: L.mapbox.gridLayer('urbaninstitute.h564j9k9')
    },{
        name: '2010',
        layer: init('urbaninstitute.wcbd42t9'), //1990
        grid: L.mapbox.gridLayer('urbaninstitute.wcbd42t9')
    } ];

    var control = document.getElementById('layers');

    // Add a play button div
//                var play_button = control.appendChild(document.createElement('a'))
//                var pause = "&#9616;&#9616;";
//                var play = "&#9654;";
//                play_button.innerHTML = pause;
//                play_button.id = "play_button";
//                play_button.onclick = function () {
//                    if (nextInterval) {
//                        nextInterval = clearInterval(nextInterval);
//                        play_button.innerHTML = play;
//                    } else {
//                        highlightLayer(i++);
//                        if (i === 3) {
//                            i = 0
//                        };
//                        nextInterval = animate();
//                        play_button.innerHTML = pause;
//                    }
//                }

    layers.forEach(function(layer, n) {
        layer.button = control.appendChild(document.createElement('a'));
        layer.button.innerHTML = layers[n].name;
        layer.button.onclick = function() {
            console.log(n);
            highlightLayer(n);
        };
        
    });

    // we use a layer group to make it simple to remove an existing overlay
    // and add a new one in the same line of code, as below, without juggling
    // temporary variables.
    var layerGroup = L.layerGroup().addTo(map);

    // start on 2010
    highlightLayer(2);

    // var active;
    function highlightLayer(i) {
     
            layerGroup.clearLayers();
        
        layerGroup.addLayer(layers[i].layer);
        var gridControl = L.mapbox.gridControl(layers[i].grid);
        map.addLayer(layers[i].grid);

        var count = document.getElementById('count');

        var active = control.getElementsByClassName('active');
        var defaultlegend = document.getElementById('legend');
        for (var j = 0; j < active.length; j++) active[j].className = '';
        layers[i].button.className = 'active';

    }

    
    

    //streets on top
    var streetLayer = L.mapbox.tileLayer('urbaninstitute.h5b1kc2b');
    streetLayer
        .setZIndex(100)
        .addTo(map);

});