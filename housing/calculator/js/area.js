/*
  housing burden area chart
  @bsouthga

*/
(function(d3) {

  this.burdenArea = function area() {


    function chart(selection) {

      var data = d3.entries(selection.data()[0])
                   .map(function(r) {
                      r.year = Number(r.key.replace("burden", ""));
                      r.value = Number(r.value);
                      return r;
                   });

      data.sort(function(a, b) {
        return (a.year > b.year) - (a.year < b.year);
      });

      var bb = selection.node().getBoundingClientRect();

      var margin = { top: 30, right: 40, bottom: 40, left: 40 },
          width = bb.width - margin.left - margin.right,
          height = 200 - margin.top - margin.bottom;

      var years = d3.extent(data, function(d) { return d.year; });
      years[0] -= 5;
      years[1] += 5;

      var x = d3.scale.linear()
        .domain(years)
        .range([0, width]);

      var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.value; })])
        .range([height, 0]);

      var line = d3.svg.line()
          .x(function(d) { return x(d.year); })
          .y(function(d) { return y(d.value); });

      var area = d3.svg.area()
          .x(function(d) { return x(d.year); })
          .y0(height)
          .y1(function(d) { return y(d.value); });

      var xAxis = d3.svg.axis()
          .ticks(4)
          .scale(x)
          .outerTickSize(0)
          .tickFormat(function(d) { return d; })
          .orient("bottom");

      var svg = selection.html('').append('svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      var n_data = data.map(function(r) {
            return {year : r.year, value : 0};
          });

      var area_path = svg.append("path")
          .datum(n_data)
          .attr("class", "area")
          .attr("d", area);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // animation durations
      var dur = {
        area : 1000,
        line : 1000,
        circle : 200
      };

      area_path
          .datum(data)
          .transition()
          .duration(dur.area)
          .attr("d", area);

      line_path = svg.append("path")
        .attr("class", "line")
        .attr("d", line(data))
        .attr("fill", "none");

      var totalLength = line_path.node().getTotalLength();

      line_path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .delay(dur.area)
        .duration(dur.line)
        .ease("linear")
        .attr("stroke-dashoffset", 0);

      var circles = svg.selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', function(d) { return x(d.year); })
        .attr('cy', function(d) { return y(d.value); })
        .attr('r', 0);

      circles.transition()
        .delay(function(d, i) {
          return dur.area + i*(dur.line/(data.length-1));
        })
        .duration(dur.circle)
        .attr('r', 4);

      var format = d3.format("%");

      var labels = svg.append('g').selectAll('text')
        .data(data)
        .enter().append('text')
        .attr('class', 'label')
        .text(function(d) { return format(d.value) ; })
        .attr('x', function(d) {
          var bb = this.getBBox();
          return x(d.year) - bb.width/2;
        })
        .attr('y', function(d) {
          var bb = this.getBBox();
          return y(d.value) - bb.height;
        })
        .style('opacity', 0);

      labels.transition()
        .delay(function(d, i) {
          return dur.area + i*(dur.line/(data.length-1));
        })
        .duration(dur.circle)
        .style('opacity', 1);


    }

    return chart;
  };

}).call(this, d3);