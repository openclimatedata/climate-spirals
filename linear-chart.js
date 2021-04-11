"use strict"

var app = require("./app.js")

var duration = app.duration
var color = app.color
var margin = app.margin
var padding = app.padding
var formatYear = app.formatYear
var format = app.format

module.exports = function emissionsChart() {

  var width = app.width - app.margin.left - app.margin.right
  var height = app.heightLineChart
  var domain = [0, 1]
  var unit = ""
  var delay = function(d, index) {
    return index * duration
  }

  var xScale = d3.scaleTime()
    .domain([new Date(1850, 0, 1), new Date(2021, 12, 31)])
    .range([padding, width])
    .clamp(true)

  var yScale = d3.scaleLinear()
    .domain(domain)
    .range([height - padding, padding])

  var xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(formatYear)

  var yAxis = d3.axisLeft()
    .scale(yScale)

  var line = d3.line()
    .x(function(d) {
      if (d.month) {
        return xScale(new Date(d.year, d.month))
      }
      else {
        return xScale(new Date(d.year, 0))
      }
    })
    .y(function(d) { return yScale(d.value) })

  var mousemove = function() {
    if (chart.running) {
      return false
    }
    var date = xScale.invert(d3.mouse(this)[0])
    var year = date.getFullYear()
    var month = date.getMonth()
    app.dispatch.call("show", {year: year, month: month})
  }

  function chart(selection) {
    var data = selection.data()[0]
    chart.data = data
    chart.lastYear = data[data.length - 1].year

    var svg = selection.append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var lines = svg.append("g")

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x axis")
      .call(xAxis)
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

    chart.vertLine = svg.append("line")
      .attr("class", "vertical-line")
      .attr("y1", yScale.range()[0])
      .attr("y2", yScale.range()[1])
      .attr( "stroke", "gray" )
      .attr( "stroke-width", "1")
    chart.vertLineText = svg.append("text")
      .attr("class", "hover-text")

    svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mousemove", mousemove)

    data.forEach(function(item, index){
      if (index >= data.length - 1) { return }
      var currentData = data.slice(index, index + 2)
      lines.append("path")
        .datum(currentData)
        .attr("d", line)
        .attr("class", "period")
        .attr("stroke", color(currentData[0].year))
        .attr("opacity", 0)
    })

    svg.on("start", chart.run)
    svg.on("end", chart.stop)

    chart.svg = svg
  }

  chart.domain = function(value) {
    if (!arguments.length) return domain
    domain = value
    yScale.domain(domain)
    return chart
  }

  chart.unit = function(value) {
    if (!arguments.length) return unit
    unit = value
    return chart
  }

  chart.delay = function(value) {
    if (!arguments.length) return delay
    delay = value
    return chart
  }


  chart.run = function() {
    chart.svg.selectAll("path.period[opacity='0.2']")
      .attr("opacity", 0)
    chart.svg.selectAll("path.period[opacity='0']")
      .transition().delay(delay)
      .attr("opacity", 1)
      .on("end", function(d){
        if (d[d.length - 1].year === chart.lastYear) {
          app.dispatch.call("end")
          chart.running = false
        }
      })
    chart.svg.select("rect").on("mousemove", null)
    chart.running = true
  }

  chart.stop = function() {
    chart.svg.select("rect").on("mousemove", mousemove)
    chart.svg.selectAll("path.period").interrupt()
    chart.svg.selectAll("path.period:not([opacity='0'])")
      .attr("opacity", 1)
    chart.svg.selectAll("path.period[opacity='0']")
      .attr("opacity", 0.2)
    chart.running = false
  }

  chart.showUntil = function(year, month) {
    var date = new Date(year, month)
    chart.svg.selectAll("path.period")
      .attr("opacity", function(d) {
        if ((d[1].year < year) ||
            ((d[1].year === year) && (d[1].month <= month))) {
          return 1
        }
        else {
          return 0.2
        }
      })

    var value = chart.data.find(function(item) {
      if (item.month) {
        return (item.year === year) && (item.month === month)
      }
      else {
        return (item.year === year)
      }
    })
    if (value && (value.value !== null)) {
      value = format(value.value) + " " + unit
    }
    else {
      value = ""
    }

    chart.vertLine
      .attr("visibility", "visible")
      .attr("x1", xScale(date))
      .attr("x2", xScale(date))

    chart.vertLineText
      .attr("visibility", "visible")
      .attr("x", xScale(date))
      .attr("y", 0.2 * yScale.range()[0])
      .text(value)
    var bbox = chart.vertLineText.node().getBBox()
    chart.vertLineText.attr("dx", "-" + (bbox.width + 5) + "px")

  }

  return chart
}
