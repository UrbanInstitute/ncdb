var burdenData;




// store current state of data
var currentState = {
  "street" : null,
  "city" : null,
  "state" : null,
  "zip" : null,
  "rent" : null,
  "income" : null,
  "lat" : null,
  "lon" : null
};


function getAddress() {
  $('.address-input').each(function() {
    var id = this.id;
    var val = $(this).val();
    currentState[id] = val;
  });
}


function makeAPICall() {

    $('#loading-spinner').css('opacity', 1);

    // update "currentState" model with address info
    getAddress();

    var osmString = (
      "http://nominatim.openstreetmap.org/search?" +
      "street=" + currentState.street.replace(" ", "+") +
      "&city=" + currentState.city +
      "&state= " + currentState.state +
      "&postalcode=" + currentState.zip +
      "&format=json&addressdetails=1&limit=1"
    );

    $.ajax({
        url: osmString,
        type: 'GET',
        dataType: "json",
        success: function (data) {

            $('#loading-spinner').css('opacity', 0);

            if (data.length === 0) {
                badAddress();
            } else {

                var lat = currentState.lat = data[0].lat;
                var lon = currentState.lon = data[0].lon;
                var fccString = (
                    "http://data.fcc.gov/api/block/find?" +
                    "format=jsonp" +
                    "&latitude=" + lat +
                    "&longitude=" + lon +
                    "&censusYear=2010" +
                    "&showall=true" +
                    "&callback=JSONPCallback"
                );

                var jsonp = {
                    callbackCounter: 0,

                    fetch: function (url, callback) {
                        var fn = 'JSONPCallback_' + this.callbackCounter++;
                        window[fn] = this.evalJSONP(callback);
                        url = url.replace('=JSONPCallback', '=' + fn);

                        var scriptTag = document.createElement('SCRIPT');
                        scriptTag.src = url;
                        document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
                    },

                    evalJSONP: function (callback) {
                        return function (data) {
                            var validJSON = false;
                            if (typeof data == "string") {
                                try {
                                    validJSON = JSON.parse(data);
                                } catch (e) {
                                    /*invalid JSON*/
                                }
                            } else {
                                validJSON = JSON.parse(JSON.stringify(data));
                            }
                            if (validJSON) {
                                callback(validJSON);
                            } else {
                                throw ("JSONP call returned invalid or empty JSON");
                            }
                        };
                    }
                };

                jsonp.fetch(fccString, function (data) {
                    showBurden(data);
                });
            }
        },
        error: function () {
            console.log('Failed!');
        }
    });
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! START OF FUNCTIONS FOR TIM TO WRITE !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function drawMap() {

    var coords = [42, -94];

    if (currentState.lat !== null && currentState.lon !== null) {
      coords = [currentState.lat , currentState.lon];
    }

    var map = L.mapbox.map('map2', ',', {
            fadeAnimation: true,
            maxZoom: 12,
            minZoom: 3,
            attributionControl: false
        })
        .setView(coords, 4);

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
    var play_button = control.appendChild(
      document.createElement('a')
    );

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
    };

    layers.forEach(function (layer, n) {

        layer.button = control.appendChild(document.createElement('a'));
        layer.button.innerHTML = layers[n].name;
        layer.button.onclick = function () {
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
        return setInterval(function () {
            highlightLayer(i);
            if (++i >= layers.length) i = 0;
        }, 3000 * 1);

    }

    function highlightLayer(i) {
        if (i === 0) {
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

    $('#show-map, #view-burden-in-map').click(function() {
      if (currentState.lon !== null && currentState.lat !== null) {
        map.panTo([currentState.lat, currentState.lon], true);
        map.setZoom(11, true);
      }
      $(".modal-div").removeClass('plexiglass-show');
      $("#map-container").addClass('plexiglass-show');
    });

}

function badAddress() {
    $(".modal-div").removeClass('plexiglass-show');
    $("#address-error").addClass('plexiglass-show');
}

function badBurdenData(tractFIPS) {
    $("#fake-error").text("FIPS code " + tractFIPS + " can not be found in our data :(");
}

function calculateBurden(burden) {

    // get rent and income from data model
    var rent = currentState.rent;
    var income = currentState.income;

    var monthlyIncome = income / 12;
    var rentalBurden = rent / monthlyIncome;
    var format = d3.format(",%");
    var value = Number(burden.burden2010);
    if (rentalBurden > 0.35) {
        $("#burden-response").text(
            "You, and " +
            format(value) + " of your neighbors in 2010, are " +
            "housing burdened. You spend " +
            format(rentalBurden) +
            " of your montly income on rent."
        );
    } else {
        $("#burden-response").text(
            "You're not housing burdened, but in 2010, " +
            format(value) + " of your neighbors were."
        );
    }
}

function showBurden(data) {

    var income = currentState.income;
    var rent = currentState.rent;

    var fullFIPS = data.Block.FIPS;
    var tractFIPS = fullFIPS.substring(0, fullFIPS.length - 4);
    tractFIPS = tractFIPS.replace(/^0+/, '');

    var burden = burdenData[tractFIPS];
    calculateBurden(burden);

  $(".modal-div").removeClass('plexiglass-show');
  $("#chart-container").addClass('plexiglass-show');

    d3.select('#chart')
        .datum(burden)
        .call(burdenArea());

}



// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! END OF FUNCTIONS FOR TIM TO WRITE !!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



$(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "data/rentburden_tracts.csv",
    dataType: "text",
    success: processData
  });
});


function processData(text) {
    var lines = text.split('\n');
    var header = lines.shift();
    var data = {};

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].split(',');
        data[line[0]] = {
            "burden1980": line[1],
            "burden1990": line[2],
            "burden2000": line[3],
            "burden2010": line[4]
        };
    }
    burdenData = data;

    $('[placeholder]').focus(function () {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function () {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
        }
    }).blur();

    $('[placeholder]').parents('form').submit(function () {
        $(this).find('[placeholder]').each(function () {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
            }
        });
    });
}


$(".close-modal, #close-chart, #show-calculator").click(function () {
  $(".modal-div").removeClass('plexiglass-show');
  $("#control-container").addClass('plexiglass-show');
});



$(function() { drawMap(); });