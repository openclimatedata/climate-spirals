"use strict"

var md = new MobileDetect(window.navigator.userAgent)

var slideout = new Slideout({
  "panel": document.getElementById("panel"),
  "menu": document.getElementById("menu"),
  "padding": 256
})

// Toggle button
d3.select("#toggle-button").on("click", function() {
  slideout.toggle()
})

var app = {
  color: d3.scaleSequential(d3.interpolateViridis).domain([1850, 2016]),
  countDone: 0,
  dispatch: d3.dispatch("end", "show"),
  duration:  10,
  fadeDuration: 3000,
  format: d3.format(".1f"),
  formatYear: d3.timeFormat("%Y"),
  margin: {top: 0, right: 20, bottom: 20, left: 40},
  padding: 10,
  red: "#990000",
  root: "../",
  running: false,
  viz: []
}

app.setWidth = function(count) {
  return d3.min([700, Math.floor((window.innerWidth - 20 * count) / count)])
}
app.heightLineChart = 200 - app.margin.top - app.margin.bottom

app.showMobileWarning = function() {
  if (md.mobile()) {
    var alert = d3.select("div#alert")
    alert.style("display", "block").on("click", function(){
      alert.style("display", "none")
    })
  }
}

app.fastForward = function() {
  d3.selectAll(".vertical-line, .hover-text").attr("visibility", "hidden")
  if (app.running) {
    d3.select("#status").classed("icon-play3", true)
    d3.select("#status").classed("icon-pause2", false)
    app.viz.forEach(function(v) { v.svg.dispatch("end") })
  }
  else {
    d3.select("#status").classed("icon-play3", false)
    d3.select("#status").classed("icon-pause2", true)
    app.viz.forEach(function(v) { v.svg.dispatch("start") })
  }
  app.running = !app.running
}

app.dispatch.on("end", function() {
  d3.selectAll("svg, span#status").on("click", null)
  app.countDone += 1
  d3.select("#status").style("opacity", 0.2)
  app.running = false
  if (app.countDone === app.viz.length) {
    app.countDone = 0
    d3.timeout(function() {
      d3.selectAll("text.year").text("")
      d3.selectAll("path.period")
        .transition().duration(app.fadeDuration).attr("opacity", 0)

      d3.timeout(function restart() {
        app.start()
        d3.select("#status").style("opacity", 1)
      }, app.fadeDuration)
    }, 3500)
  }
})

app.dispatch.on("show", function() {
  var year = this.year
  var month = this.month || 12
  app.viz.forEach(function(v) { v.showUntil(year, month) })
})

app.start = function() {
  app.viz.forEach(function(v) { v.svg.dispatch("start") })
  d3.selectAll("svg, span#status").on("click", app.fastForward)
  app.running = true
}

module.exports = app
