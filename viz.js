"use strict"

var app = require("./app")
var budgetChart = require("./budget-chart")
var spiralChart = require("./spiral-chart")
var linearChart = require("./linear-chart")

module.exports = {

  "emissionsBudget": function() {
    var budget = budgetChart()
    app.viz.push(budget)

    d3.select("#emissions-budget")
      .datum(app.emissionsData)
      .call(budget)
    return budget
  },

  "emissionsLinear": function() {
    var emissionsLinear = linearChart()
      .domain([0, 45])
      .unit("GtCO₂")
      .delay(function(d, index) {
        return (index + 1) * app.duration * 12
      })
    app.viz.push(emissionsLinear)

    d3.select("#emissions-linear")
    .datum(app.emissionsData)
    .call(emissionsLinear)
  },

  "concentrationSpiral": function(id, data) {
    if (typeof id === "undefined") {
      id = "#concentration-spiral"
    }
    if (typeof data === "undefined") {
      data = app.concentrationData
    }
    var concentrationSpiral = spiralChart()
      .domain([250, 450])
      .unit("ppm")
    app.viz.push(concentrationSpiral)

    d3.select(id)
      .datum(data)
      .call(concentrationSpiral)
    return concentrationSpiral
  },

  "concentrationLinear": function(id, data) {
    if (typeof id === "undefined") {
      id = "#concentration-linear"
    }
    if (typeof data === "undefined") {
      data = app.concentrationData
    }
    var concentrationLine = linearChart()
      .domain([270, 450])
      .unit("ppm")
    app.viz.push(concentrationLine)

    d3.select(id)
      .datum(data)
      .call(concentrationLine)
  },

  "temperatureSpiral": function() {
    var temperatureSpiral = spiralChart()
      .domain([-0.75, 2])
      .unit("°C")
    app.viz.push(temperatureSpiral)

    d3.select("#temperature-spiral")
      .datum(app.temperatureData)
      .call(temperatureSpiral)
      .selectAll("circle").attr("class", function(d) {
        if (d === 1.5) {
          return "red"
        }
      })
    return temperatureSpiral
  },

  "temperatureLinear": function() {
    var temperatureLinear = linearChart()
      .domain([-0.1, 2.1])
      .unit("°C")
    app.viz.push(temperatureLinear)

    d3.select("#temperature-linear")
      .datum(app.temperatureData)
      .call(temperatureLinear)
  }
}
