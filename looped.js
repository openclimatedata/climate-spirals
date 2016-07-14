"use strict"

var app = require("./app")
app.duration = 10

var load = require("./load-data.js")
var viz = require("./viz.js")

app.showMobileWarning()
app.width = 600
app.height = app.width
app.radius = app.width / 2 - 35

var budget, concentration, temperature

var fadeOut = 2000
var fadeIn = 1000

var index = 0

var budgetWrapper = d3.select("#budget")
var concentrationWrapper = d3.select("#concentration")
var temperatureWrapper = d3.select("#temperature")

app.dispatch.on("end", function() {
  switch (index) {
  case 0:
    index = 1
    budgetWrapper.transition().duration(fadeOut)
      .style("opacity", 0)
      .on("end", function() {
        budgetWrapper.classed("hidden", true)
        concentrationWrapper.style("opacity", 0).classed("hidden", false)
        concentrationWrapper.transition().duration(fadeIn).style("opacity", 1)
        concentration.svg.selectAll("path.period").attr("opacity", 0)
        concentration.svg.dispatch("start")
      })
    break
  case 1:
    index = 2
    concentrationWrapper.transition().duration(fadeOut)
      .style("opacity", 0)
      .on("end", function() {
        concentrationWrapper.style("opacity", 0).classed("hidden", true)
        temperatureWrapper.classed("hidden", false)
          .transition().duration(fadeIn).style("opacity", 1)
        temperature.svg.selectAll("path.period").attr("opacity", 0)
        temperature.svg.dispatch("start")
      })
    break
  case 2:
    index = 0
    temperatureWrapper.transition().duration(fadeOut)
      .style("opacity", 0)
      .on("end", function() {
        temperatureWrapper.style("opacity", 0).classed("hidden", true)
        budgetWrapper.classed("hidden", false)
          .transition().duration(fadeIn).style("opacity", 1)
        budget.svg.selectAll("path.period").attr("opacity", 0)
        budget.svg.dispatch("start")
      })
    break
  default:
    break
  }
})

var q = d3.queue()

q.defer(load.emissionsData)
q.defer(load.concentrationData)
q.defer(load.temperatureData)

q.await(function startVisualisation(error) {
  if (error) throw error

  budget = viz.emissionsBudget()
  concentration = viz.concentrationSpiral()
  temperature = viz.temperatureSpiral()

  concentrationWrapper.classed("hidden", true)
  temperatureWrapper.classed("hidden", true)

  d3.selectAll("svg, span#status").on("click", function() {
    if (app.running) {
      d3.select("#status").classed("icon-play3", true)
      d3.select("#status").classed("icon-pause2", false)
      budget.svg.dispatch("end")
      concentration.svg.dispatch("end")
      temperature.svg.dispatch("end")
    }
    else {
      d3.select("#status").classed("icon-play3", false)
      d3.select("#status").classed("icon-pause2", true)
      switch (index) {
      case 0:
        budget.svg.dispatch("start")
        break
      case 1:
        concentration.svg.dispatch("start")
        break
      case 2:
        temperature.svg.dispatch("start")
        break
      default:
        break
      }
    }
    app.running = !app.running
  })


  budget.svg.dispatch("start")
  app.running = true
})
