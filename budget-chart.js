"use strict"

// Spiral chart

var app = require("./app.js")

var duration = app.duration
var color = app.color

module.exports = function radialChart() {

  var radius = app.radius
  var width = app.width
  var height = app.height
  chart.unit = ""

  // C.1.3 in the IPCC Special Report on 1.5 SPM
  // https://report.ipcc.ch/sr15/pdf/sr15_spm_final.pdf
  // accounting for permafrost thawing
  // and
  // Rogelj et al. 2019 https://doi.org/10.1038/s41586-019-1368-z
  // Using a probability of limiting global warming of 66%
  // <2    1070 GtCO2
  // <1.5  320 GtCO2
  //
  // Cumulative emissions from 1850 are ~2300 GtCo2 for Fossil Fuel Industrial and
  // Land Use in the Global Carbon Budget

  var co2cumsum = 2300
  var budget1_5 = 320
  var budget2_0 = 1070

  var scaleCumulativeEmissions = d3.scaleLinear()
    .domain([0, co2cumsum + budget2_0])
    .range([0, 2 * Math.PI])

  // Arc.
  var arc = d3.arc()
    .innerRadius(0.2 * radius)
    .outerRadius(radius + 1)
    .startAngle(function(d) {
      return scaleCumulativeEmissions(d[0].cumulative)
    })
    .endAngle(function(d) {
      return scaleCumulativeEmissions(d[1].cumulative)
    })

  function chart(selection) {
    var data = selection.data()[0]
    chart.data = data
    chart.lastYear = data[data.length - 1].year

    var svg = selection.append("svg")
      .attr("class", "circle")
      .attr("width", app.width)
      .attr("height", app.height)
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
      .attr("transform", "translate(" + (width / 2) + "," + height / 2 + ")")

    var grEmis = svg.append("g")
        .attr("class", "r axis")
      .selectAll("g")
        .data([0.2 * radius, radius])
      .enter().append("g")
    grEmis.append("circle")
    .attr("r", function(d) {return d})

    svg.append("path")
      .attr("d", arc([{cumulative: co2cumsum + budget1_5}, {cumulative: co2cumsum + budget1_5}]))
      .attr("stroke", app.red)
      .attr("stroke-width", 2)
      .attr("opacity", 0.5)

    svg.append("path")
      .attr("d", arc([{cumulative: co2cumsum + budget2_0}, {cumulative: co2cumsum + budget2_0}]))
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("opacity", 0.5)

    svg.append("text")
      .text("1.5 °C Budget")
      .attr("class", "budget-line")
      .attr("x", -0.95 * radius)
      .attr("y", scaleCumulativeEmissions(co2cumsum + budget1_5))
      .attr("transform", "rotate(7)")

    svg.append("text")
      .text("2 °C Budget")
      .attr("class", "budget-line")
      .attr("y", 15)
      .attr("x", -0.95 * radius)
      .attr("transform", "rotate(90)")

    chart.text = svg.append("text")
      .attr("class", "year")
      .attr("x", -17)
      .attr("dy", 5)

    data.forEach(function(item, index){
      if (index >= data.length - 1) { return }
      var currentData = data.slice(index, index + 2)

      svg.append("path")
        .datum(currentData)
        .attr("class", "period")
        .attr("d", arc(currentData))
        .attr("stroke", color(currentData[0].year))
        .attr("fill", color(currentData[0].year))
        .attr("opacity", 0)

    })

    svg.on("start", chart.run)
    svg.on("end", chart.stop)

    chart.svg = svg
  }

  chart.run = function() {
    chart.svg.selectAll("path.period[opacity='0']")
      .transition().delay(function(d, index) {
        chart.text.transition()
          .delay((index) * 12 * duration).text(d[0].year)
        if (d[1].year === chart.lastYear) {
          chart.text.transition()
            .delay((index + 1) * 12 * duration)
            .text(chart.lastYear)
        }
        return (index + 1) * duration * 12
      })
      .attr("opacity", 1)
      .on("end", function(d){
        if (d[d.length - 1].year === chart.lastYear) {
          app.dispatch.call("end")
          chart.running = false
        }
      })
    chart.running = true
  }

  chart.stop = function() {
    chart.text.interrupt()
    chart.svg.selectAll("path.period").interrupt()
    chart.svg.selectAll("path.period:not([opacity='0'])")
      .attr("opacity", 1)
    chart.running = false
  }

  chart.showUntil = function(year) {
    chart.svg.selectAll("path.period")
      .attr("opacity", function(d) {return d[1].year <= year ? 1 : 0})
    chart.text.text(d3.min([year, chart.lastYear]))
  }

  return chart
}
