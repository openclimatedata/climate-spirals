var fs = require("fs")
var nunjucks = require("nunjucks")

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader("templates"))

var write = function(template, title) {
  console.log("Writing " + template)
  fs.writeFileSync(
  "public/" + template + "/index.html",
    env.render(template + ".html", {title: title})
  )
}


write("looped", "Looped Climate Spirals")

write("carbon-budget", "Carbon Budget")
write("concentration", "Concentration Spiral")
write("temperature", "Temperature Spiral")
write("carbon-budget-temperature", "Budget & Temperature")
write("concentration-temperature", "Concentration & Temperature")
write("carbon-budget-concentration", "Budget & Concentration")
write("from-emissions-to-global-warming", "From Emissions To Global Warming")

write("carbon-budget-line-chart", "Carbon Budget with Line Chart")
write("concentration-line-chart", "Concentration Spiral with Line Chart")
write("temperature-line-chart", "Temperature Spiral with Line Chart")
write("carbon-budget-temperature-line-chart", "Budget & Temperature with Line Chart")
write("concentration-temperature-line-chart", "Concentration & Temperature with Line Chart")
write("carbon-budget-concentration-line-chart", "Budget & Concentration with Line Chart")
write("from-emissions-to-global-warming-line-chart", "From Emissions To Global Warming with Line Chart")
