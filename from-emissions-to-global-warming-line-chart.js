"use strict"

var app = require("./app")

var load = require("./load-data.js")
var viz = require("./viz.js")

app.showMobileWarning()

app.width = Math.floor((window.innerWidth - 20 * 3) / 3)
app.height = app.width
app.radius = app.width / 2 - 35

var q = d3.queue()

q.defer(load.emissionsData)
q.defer(load.concentrationData)
q.defer(load.temperatureData)

q.await(function startVisualisation(error) {
  if (error) throw error

  viz.emissionsBudget()
  viz.emissionsLinear()
  viz.concentrationSpiral()
  viz.concentrationLinear()
  viz.temperatureSpiral()
  viz.temperatureLinear()
  // Fix for too wide source text.
  d3.selectAll("div.col div.sources").style("width", app.width + "px")

  app.start()

})
