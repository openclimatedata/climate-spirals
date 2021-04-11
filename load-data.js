"use strict"

var app = require("./app.js")

function row(d) {
  var obj = {
    year: +d.year,
    value: +d.value
  }
  if (d.month) {
    obj.month = +d.month - 1 // JS 0-based month
  }
  return obj
}

module.exports = {
  "emissionsData": function loadEmissions(callback) {
    d3.csv("../emissions.csv", row, function(error, data) {
      if (error) throw error
      data = data.map(function(item, index, list) {
        if (index > 0) {
          item.cumulative = list[index - 1].cumulative + item.value
        }
        else {
          item.cumulative = item.value
        }
        return item
      })
      app.emissionsData = data
      callback(null)
    })
  },
  "concentrationData": function loadConcentrations(callback) {
    d3.csv("../concentrations.csv", row, function(error, data) {
      if (error) throw error
      app.concentrationData = data
      callback(null)
    })
  },
  "concentrationNHData": function loadConcentrations(callback) {
    d3.csv("../concentrations_nh.csv", row, function(error, data) {
      if (error) throw error
      app.concentrationNHData = data
      callback(null)
    })
  },
  "concentrationSHData": function loadConcentrations(callback) {
    d3.csv("../concentrations_sh.csv", row, function(error, data) {
      if (error) throw error
      app.concentrationSHData = data
      callback(null)
    })
  },
  "temperatureData": function loadTemperature(callback) {
    d3.csv("../temperatures.csv", row, function(error, data) {
      if (error) throw error
      app.temperatureData = data
      callback(null)
    })
  }
}
