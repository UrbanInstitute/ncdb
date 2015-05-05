$(function() {
    var initLat = 40;
    var initLon = -91;

    $("#embed").click(function() {
        $("#embed-modal").attr("style", "display:block;z-index:10;opacity:1;height:550px;");
    });
    $(".close-modal").click(function() {
        $("#embed-modal").attr("style", "display:none;z-index:10;opacity:0;");
        $("#about-modal").attr("style", "display:none;z-index:10;opacity:0;");
    });

    $("#about").click(function() {
        $("#about-modal").attr("style", "display:block;z-index:10;opacity:1;height:550px;");
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

    var map = L.mapbox.map('map', 'urbaninstitute.7438ce9f,', {
            fadeAnimation: true,
            maxZoom: 12,
            minZoom: 5,
            attributionControl: false
        })
        .setView([initLat, initLon], 5);
    //.setView([41.9023, -87.7080], 10);

    L.mapbox.accessToken = 'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ';
<<<<<<< HEAD:immigrants-reshaping-residential-segregation/immigration-map2.js
//    var hash = L.hash(map);
=======
  //  var hash = L.hash(map);
>>>>>>> 3c3ee31426667073179999e2c0ecd24ff850405d:immigrants-reshaping-residential-segregation/immigration-map2.js

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
    //            var play_button = control.appendChild(document.createElement('a'))
    //            var pause = "&#9616;&#9616;";
    //            var play = "&#9654;";
    //            play_button.innerHTML = pause;
    //            play_button.id = "play_button";
    //            play_button.onclick = function () {
    //                if (nextInterval) {
    //                    nextInterval = clearInterval(nextInterval);
    //                    play_button.innerHTML = play;
    //                } else {
    //                    highlightLayer(i++);
    //                    if (i === 3) {
    //                        i = 0
    //                    };
    //                    nextInterval = animate();
    //                    play_button.innerHTML = pause;
    //                }
    //            }

    layers.forEach(function(layer, n) {
        layer.button = control.appendChild(document.createElement('a'));
        layer.button.innerHTML = layers[n].name;
        layer.button.onclick = function() {
            highlightLayer(n);
        };
        layer.grid.on('mouseover', function(o) {
            if (o.data) {
                drawKey(o.data, n);
            }
        });
    });

    // we use a layer group to make it simple to remove an existing overlay
    // and add a new one in the same line of code, as below, without juggling
    // temporary variables.
    var layerGroup = L.layerGroup().addTo(map);

    // start on 2010
    highlightLayer(2);

    // var active;
    function highlightLayer(i) {
        i = i % 3;
        if (i === 0) {
            layerGroup.clearLayers();
        }
        layerGroup.addLayer(layers[i].layer);
        var gridControl = L.mapbox.gridControl(layers[i].grid);
        map.addLayer(layers[i].grid);

        var count = document.getElementById('count');

        var active = control.getElementsByClassName('active');
        var defaultlegend = document.getElementById('legend');
        for (var j = 0; j < active.length; j++) active[j].className = '';
        layers[i].button.className = 'active';

    }

    function drawKey(data, index) {
        var SES;
        var legend = document.getElementById('legend');
        var legendtext = document.getElementById('legend-text');
        var el;
        switch (String(index)) {
            case "0":
                if (typeof(data.SES9) != "undefined") {
                    el = d3.select(".ses" + data.SES9 + ".immig" + data.key9);
                    d3.selectAll(".selected").classed("selected", false);
                    el.classed("selected", true);
                    el[0][0].parentNode.appendChild(el[0][0]);
                    legendtext.innerHTML = "<div id='year'>1990</div><div class='key-label'>Tract SES :: <span class='key-data'>" + data.SES90t + "</span></div><div class='key-label'>Share of immigrants :: <span class='key-data'>" + data.share90 + "%</span></div>";

                }

                break;
            case "1":
                if (typeof(data.SES0) != "undefined") {
                    el = d3.select(".ses" + data.SES0 + ".immig" + data.key0);
                    d3.selectAll(".selected").classed("selected", false);
                    el.classed("selected", true);
                    el[0][0].parentNode.appendChild(el[0][0]);
                    legendtext.innerHTML = "<div id='year'>2000</div><div class='key-label'>Tract SES :: <span class='key-data'>" + data.SES00t + "</span></div><div class='key-label'>Share of immigrants :: <span class='key-data'>" + data.share00 + "%</span></div>";
                }
                break;
            case "2":
                if (typeof(data.SES1A) != "undefined") {
                    el = d3.select(".ses" + data.SES1A + ".immig" + data.key1a);
                    d3.selectAll(".selected").classed("selected", false);
                    el.classed("selected", true);
                    el[0][0].parentNode.appendChild(el[0][0]);
                    legendtext.innerHTML = "<div id='year'>2010</div><div class='key-label'>Tract SES :: <span class='key-data'>" + data.SES10tim + "</span></div><div class='key-label'>Share of immigrants :: <span class='key-data'>" + data.share10 + "%</span></div>";
                }
                break;

        }
    }

    //streets on top
    var streetLayer = L.mapbox.tileLayer('urbaninstitute.h5b1kc2b');
    streetLayer
        .setZIndex(100)
        .addTo(map);

});