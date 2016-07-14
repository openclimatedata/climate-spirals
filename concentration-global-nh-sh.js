"use strict"

var app = require("./app")

app.width =  app.setWidth(3)
app.height = app.width
app.radius = app.width / 2 - 35


var load = require("./load-data.js")
var viz = require("./viz.js")

app.showMobileWarning()

var q = d3.queue()

q.defer(load.concentrationData)
q.defer(load.concentrationNHData)
q.defer(load.concentrationSHData)

q.await(function startVisualisation(error) {
  if (error) throw error

  viz.concentrationSpiral()
  viz.concentrationLinear()
  viz.concentrationSpiral("#concentration-spiral-nh", app.concentrationNHData)
  viz.concentrationLinear("#concentration-linear-nh", app.concentrationNHData)
  viz.concentrationSpiral("#concentration-spiral-sh", app.concentrationSHData)
  viz.concentrationLinear("#concentration-linear-sh", app.concentrationSHData)

  app.start()

})
