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
            if (i === 3){ i = 0};
            nextInterval = animate();
            play_button.innerHTML = pause;
        }
    }

    layers.forEach(function (layer, n) {
        layer.button = control.appendChild(document.createElement('a'));
        layer.button.innerHTML = layers[n].name;
        layer.button.onclick = function () {
            i = n
            highlightLayer();
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
        // var i = 0
            // and then time the next() function to run every 1 seconds
        return setInterval(function () {
            highlightLayer();
            if (++i >= layers.length) i = 0;
        }, 1000 * 1);
    }

    // var active;
    function highlightLayer() {
        i = i%3
        if (i == 0) {
            layerGroup.clearLayers();
        }
        layerGroup.addLayer(layers[i].layer);
        var gridControl = L.mapbox.gridControl(layers[i].grid);
        map.addLayer(layers[i].grid);

        var count = document.getElementById('count');


        var active = control.getElementsByClassName('active');
        var activeLayer = layers[i].grid
         var defaultlegend = document.getElementById('legend');
        activeLayer.on("mousemove", function (o) {
            if (o.data) {
                drawKey(o.data, i)
            }else{
    //           defaultlegend.innerHTML = "<img class='key' src='key/ncdb-key.png'/>";   
            }
        })
        for (var j = 0; j < active.length; j++) active[j].className = '';
        layers[i].button.className = 'active';

    }

    function drawKey(data, index) {
        var SES;
        var legend = document.getElementById('legend');
        var legendtext = document.getElementById('legend-text');
       // console.log(data);
        d3.selectAll(".selected").classed("selected",false)
        var el;
        switch (String(index)) {
        case "0":
            if (typeof (data.SES9) != "undefined") {
                el = d3.select(".ses"+data.SES9 + ".immig"+data.key9)
                el.classed("selected",true)
                el[0][0].parentNode.appendChild(el[0][0])
            }
            
            break
        case "1":
            if (typeof (data.SES0) != "undefined") {
                el = d3.select(".ses"+data.SES0 + ".immig"+data.key0)
                el.classed("selected",true)
                el[0][0].parentNode.appendChild(el[0][0])
            }
            break
        case "2":
            if (typeof (data.SES1A) != "undefined") {
                el = d3.select(".ses"+data.SES1A + ".immig"+data.key1a)
                el.classed("selected",true)
                el[0][0].parentNode.appendChild(el[0][0])
            }
            break
            
        }
        // el.classed("selected",true)
        // el[0][0].parentNode.appendChild(el[0][0])
    }

    //streets on top
    var streetLayer = L.mapbox.tileLayer('urbaninstitute.h5b1kc2b');
    streetLayer
        .setZIndex(100)
        .addTo(map);



});