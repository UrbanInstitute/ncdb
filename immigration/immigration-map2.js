$(document).ready(function () {
    var map = L.mapbox.map('map', 'urbaninstitute.7438ce9f,', {
            fadeAnimation: true,
            maxZoom: 12,
            minZoom: 4,
            attributionControl: false
        })
        .setView([41.9023, -87.7080], 10);

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
        layer: init('urbaninstitute.p0pjsjor'), //1990
        grid: L.mapbox.gridLayer('urbaninstitute.p0pjsjor')
        }, {
        name: '2000',
        layer: init('urbaninstitute.hhwljtt9'), //2000
        grid: L.mapbox.gridLayer('urbaninstitute.hhwljtt9')
        }, {
        name: '2010',
        layer: init('urbaninstitute.k89nqaor'), //2010
        grid: L.mapbox.gridLayer('urbaninstitute.k89nqaor')

        }];

    var control = document.getElementById('layers');

    // Add a play button div
        var play_button = control.appendChild(document.createElement('a'))
        var pause = "&#9616;&#9616;";
        var play = "&#9654;";
        play_button.innerHTML = pause;
        play_button.id = "play_button";
        play_button.onclick = function () {
            if (nextInterval) {
                nextInterval = clearInterval(nextInterval);
                play_button.innerHTML = play;
            } else {
                highlightLayer(i++);
                if (i === 12) i = 0;
                nextInterval = animate();
                play_button.innerHTML = pause;
            }
        }

        layers.forEach(function (layer, n) {
            layer.button = control.appendChild(document.createElement('a'));
            layer.button.innerHTML = layers[n].name;
            layer.button.onclick = function () {
                highlightLayer();
                i = n
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
        var i = 0
        // and then time the next() function to run every 1 seconds
        return setInterval(function () {
            highlightLayer();
            if (++i >= layers.length) i = 0;
        }, 3000 * 1);
    }

    // var active;
    function highlightLayer() {
        if (i == 0) {
            layerGroup.clearLayers();
        }
        layerGroup.addLayer(layers[i].layer);
        var gridControl = L.mapbox.gridControl(layers[i].grid);
        map.addLayer(layers[i].grid);

        var count = document.getElementById('count');


        var active = control.getElementsByClassName('active');
        var activeLayer = layers[i].grid
        activeLayer.on("mousemove",function(o){
            if(o.data){
                drawKey(o.data, i)
            }
        })
        for (var j = 0; j < active.length; j++) active[j].className = '';
        layers[i].button.className = 'active';

    }

    function drawKey(data, index){
        var legend = document.getElementById('legend')
        switch(String(index)){
            case "0":
                if(typeof(data.SES9) != "undefined"){
                    $(legend).text = "SES: " + data.SES9 + "<br/>Share bin: " + data.key9 + "<br/>Share: " + data.share90
                }
                break
            case "1":
                if(typeof(data.SES0) != "undefined"){
                    legend.innerHTML = "SES: " + data.SES0 + "<br/>Share bin: " + data.key0 + "<br/>Share: " + data.share00
                }
                break
            case "2":
                if(typeof(data.SES1A) != "undefined"){
                    legend.innerHTML = "SES: " + data.SES1A + "<br/>Share bin: " + data.key1a + "<br/>Share: " + data.share10
                }
                break
        }
    }

    //streets on top
    var streetLayer = L.mapbox.tileLayer('urbaninstitute.h5b1kc2b');
    streetLayer
        .setZIndex(100)
        .addTo(map);

    $('#chicago').click(function () {
        map.panTo([41.8644, -87.8947], 10);
    });
    $('#washington').click(function () {
        map.panTo([38.9423, -77.1872], 10);
    });
    $('#minneapolis').click(function () {
        map.panTo([44.9638, -93.2368], 10);
    });
    $('#atlanta').click(function () {
        map.panTo([33.7894, -84.3393], 10);
    });
    $('#houston').click(function () {
        map.panTo([29.7632, -95.3819], 10);
    });

    $('#lasvegas').click(function () {
        map.panTo([36.1467, -115.3317], 10);
    });
    $('#sanjose').click(function () {
        map.panTo([37.3194, -121.9812], 10);
    });
    $('#seattle').click(function () {
        map.panTo([47.5311, -122.2696], 10);
    });
    $('#fresno').click(function () {
        map.panTo([36.5494, -119.7208], 10);
    });
    $('#miami').click(function () {
        map.panTo([25.8382, -80.3307], 10);
    });
    $('#newyork').click(function () {
        map.panTo([40.8013, -73.8831], 10);
    });
    $('#detroit').click(function () {
        map.panTo([42.3981, -83.3505], 10);
    });
    $('#cleveland').click(function () {
        map.panTo([41.4952, -81.5900], 10);
    });
    $('#phoenix').click(function () {
        map.panTo([33.4819, -111.9589], 10);
    });


});