var burdenData;

function makeAPICall() {

  $('#loading-spinner').css('opacity', 1);

  var street = $('#street').val();
  var city = $('#city').val();
  var state = $('#state').val();
  var zip = $('#zip').val();

  var rent = $('#rent').val();
  var income = $('#income').val();

  var osmString = (
    "http://nominatim.openstreetmap.org/search?" +
      "street=" + street.replace(" ", "+") +
      "&city=" + city +
      "&state= " + state +
      "&postalcode=" + zip +
      "&format=json&addressdetails=1&limit=1"
  );

  $.ajax({
    url: osmString,
    type: 'GET',
    dataType: "json",
    success: function(data) {

      $('#loading-spinner').css('opacity', 0);

      if (data.length === 0) {
        badAddress();
      } else {

        var lat = data[0].lat;
        var lon = data[0].lon;
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

          fetch: function(url, callback) {
            var fn = 'JSONPCallback_' + this.callbackCounter++;
            window[fn] = this.evalJSONP(callback);
            url = url.replace('=JSONPCallback', '=' + fn);

            var scriptTag = document.createElement('SCRIPT');
            scriptTag.src = url;
            document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
          },

          evalJSONP: function(callback) {
            return function(data) {
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

        jsonp.fetch(fccString, function(data) {
          showBurden(rent, income, data);
          //drawMap(lat, lon);
        });
      }
    },
    error: function() {
      console.log('Failed!');
    }
  });
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! START OF FUNCTIONS FOR TIM TO WRITE !!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

function drawMap(lat, lon) {
  $("#fake-map").text(lat + ", " + lon);

  var map = L.mapbox.map('map', ',', {
      fadeAnimation: true,
      maxZoom: 12,
      minZoom: 4
    })
    .setView([lat, lon], 10);

  L.mapbox.accessToken = 'pk.eyJ1IjoidXJiYW5pbnN0aXR1dGUiLCJhIjoiTEJUbmNDcyJ9.mbuZTy4hI_PWXw3C3UFbDQ';
  var hash = L.hash(map);

  // urban institute credit on the map
  map.attributionControl
    .addAttribution('<a href="http://www.urban.org/">&copy; Urban Institute</a>');

  //streets on top
  var streetLayer = L.mapbox.tileLayer('urbaninstitute.h5b1kc2b');
  streetLayer
    .setZIndex(100)
    .addTo(map);

}

function badAddress() {
  $("#address-error").attr("style", "display:block;opacity:1;");
}

function badBurdenData(tractFIPS) {
  $("#fake-error").text("FIPS code " + tractFIPS + " can not be found in our data :(");
}

function calculateBurden(rent, income, burden) {
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

function showBurden(rent, income, data) {
  var fullFIPS = data.Block.FIPS;
  var tractFIPS = fullFIPS.substring(0, fullFIPS.length - 4);
  tractFIPS = tractFIPS.replace(/^0+/, '');

  var burden = burdenData[tractFIPS];
  calculateBurden(rent, income, burden);
  $("#chart-container").attr("style", "display:block;opacity:1;");
  $("#input-fields").css("opacity", 0);
  d3.select('#chart')
    .datum(burden)
    .call(burdenArea());

  // if (typeof(burden) !== "undefined") {
  //   $("#burden-response").append("In 1990, " + burden.burden1990 * 100 + "% were burdened.");
  //   $("#burden-response").append(burden.burden2000);
  //   $("#burden-response").append(burden.burden2010);
  // } else {
  //   badBurdenData(tractFIPS);
  // }
}



// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!! END OF FUNCTIONS FOR TIM TO WRITE !!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

$(document).ready(function() {
  $.ajax({
    type: "GET",
    url: "data/rentburden_tracts.csv",
    dataType: "text",
    success: function(data) {
      processData(data);
    }
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

  $('[placeholder]').focus(function() {
    var input = $(this);
    if (input.val() == input.attr('placeholder')) {
      input.val('');
      input.removeClass('placeholder');
    }
  }).blur(function() {
    var input = $(this);
    if (input.val() == '' || input.val() == input.attr('placeholder')) {
      input.addClass('placeholder');
      input.val(input.attr('placeholder'));
    }
  }).blur();

  $('[placeholder]').parents('form').submit(function() {
    $(this).find('[placeholder]').each(function() {
      var input = $(this);
      if (input.val() == input.attr('placeholder')) {
        input.val('');
      }
    });
  });
}


$(".close-modal, #close-chart").click(function() {
    $(".modal-div").attr("style", "display:none;opacity:0;");
    $("#input-fields").css("opacity", 1);
});