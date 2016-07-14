"use strict"

var app = require("./app")

var load = require("./load-data.js")
var viz = require("./viz.js")

app.showMobileWarning()

app.width = 600
app.height = app.width
app.radius = app.width / 2 - 35

var q = d3.queue()

q.defer(load.temperatureData)

q.await(function startVisualisation(error) {
  if (error) throw error

  viz.temperatureSpiral()

  app.start()

})
