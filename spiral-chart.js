"use strict"

// Radial spiral chart

var app = require("./app.js")

var duration = app.duration
var color = app.color

module.exports = function radialChart() {
  var radius = app.radius
  var width = app.width
  var height = app.height
  var domain =  [0, 1]
  var unit = ""

  var months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ]

  var timescale = d3.scaleLinear()
    .range([2/12 * Math.PI , 2 * Math.PI])
    .domain([1, 12])

  var r = d3.scaleLinear()
    .range([0, radius])

  var line = d3.radialLine()
    .radius(function(d) { return r(d.value) })
    .angle(function(d) { return timescale(d.month) })

  function chart(selection) {
    var data = selection.data()[0]

    chart.data = data
    // 2nd-to-last for interpolation
    chart.lastYear = data[data.length - 2].year
    chart.lastMonth = data[data.length - 2].month
    console.log(chart.lastYear, chart.lastMonth)
    var svg = selection.append("svg")
      .attr("class", "circle")
      .attr("width", app.width)
      .attr("height", app.height)
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
      .attr("transform", "translate(" + (width / 2) + "," + height / 2 + ")")

    var gr = svg.append("g")
      .attr("class", "r axis")
      .selectAll("g")
        .data(r.ticks(4).slice(1))
        .enter().append("g")
    gr.append("circle")
      .attr("r", r)
    gr.append("text")
      .attr("y", function(d) { return -r(d) - 4 })
      .style("text-anchor", "middle")
      .text(function(d) { return d + " " + unit })

    var leg = svg.append("g")
        .attr("class", "r axis")
      .selectAll("g")
        .data(timescale.ticks(12).slice(0, 11))
      .enter().append("g")
    leg.append("text")
      .attr("y", -1.05 * radius)
      .attr("transform", function(d) { return "rotate(" + 30 * d + ")" })
      .style("text-anchor", "middle")
      .text(function(d) { return months[d - 1] })

    chart.text = svg.append("text")
      .attr("class", "year")
      .attr("x", -17)
      .attr("dy", 5)


    data.forEach(function(item, index){
      if (index >= data.length - 1) { return }
      var currentData = data.slice(index, index + 2)

      var interpolate = d3.interpolate(
        currentData[0].value, currentData[1].value)

      var points = 4

      var interpolatedData = d3.range(points + 1).map(function(index) {
        var obj = {
          "value": interpolate(index/points),
          "month": currentData[0].month + index/points,
          "year": currentData[0].year
        }
        return obj
      })
      svg.append("path")
        .datum(interpolatedData)
        .attr("class", "period")
        .attr("d", line)
        .attr("opacity", 0)
        .attr("fill", "none")
    })
    var pathSize = svg.selectAll("path.period").size()
    chart.last = d3.select(svg
      .selectAll("path.period").nodes()[pathSize - 1])

    svg.on("start", chart.run)
    svg.on("end", chart.stop)

    chart.svg = svg
  }

  chart.run = function() {
    chart.svg.selectAll("path.period[opacity='0']")
      .attr("stroke-width", 10)
      .attr("stroke", "white")
      .transition().delay(function(d, index) {
        if (d[0].month === 0) {
          chart.text.transition().delay(index * duration).text(d[0].year)
        }
        return index * duration
      })
      .attr("opacity", 0.5)
      .attr("stroke-width", 2)
      .attr("stroke", function(d) {return color(d[0].year)})
      .on("end", function(d){

        if ((d[d.length - 1].year === chart.lastYear) &&
            (d[d.length - 1].month === chart.lastMonth)) {
          chart.running = false
          app.dispatch.call("end")
        }
      })
    chart.running = true
  }

  chart.stop = function() {
    chart.text.interrupt()
    chart.svg.selectAll("path.period").interrupt()
    chart.svg.selectAll("path.period:not([opacity='0'])")
      .transition().duration(100)
        .attr("stroke-width", 2)
        .attr("opacity", 0.5)
        .attr("stroke", function(d) {return color(d[0].year)})
    chart.running = false
  }

  chart.showUntil = function(year, month) {
    chart.svg.selectAll("path.period")
      .attr("stroke-width", 2)
      .attr("stroke", function(d) {return color(d[0].year)})
      .attr("opacity", function(d) {
        if ((d[1].year < year) || ((d[1].year === year) &&
            (d[1].month <= month))) {
          return 0.5
        }
        else {
          return 0
        }
      })
    chart.text.text(d3.min([year, chart.lastYear]))
  }

  chart.domain = function(value) {
    if (!arguments.length) return domain
    domain = value
    r.domain(domain)
    return chart
  }

  chart.unit = function(value) {
    if (!arguments.length) return unit
    unit = value
    return chart
  }

  return chart
}
