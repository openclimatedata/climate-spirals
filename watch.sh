#!/bin/bash

set -o errexit
export PATH="./node_modules/.bin:$PATH"

watchify looped.js -o public/looped/bundle.js -v --debug & \
watchify concentration-global-nh-sh.js -o public/concentration-global-nh-sh/bundle.js -v --debug & \

watchify carbon-budget.js -o public/carbon-budget/bundle.js -v --debug & \
watchify concentration.js -o public/concentration/bundle.js -v --debug & \
watchify temperature.js -o public/temperature/bundle.js -v --debug & \
watchify from-emissions-to-global-warming.js -o public/from-emissions-to-global-warming/bundle.js -v --debug & \
watchify carbon-budget-temperature.js -o public/carbon-budget-temperature/bundle.js -v --debug & \
watchify concentration-temperature.js -o public/concentration-temperature/bundle.js -v --debug & \
watchify carbon-budget-concentration.js -o public/carbon-budget-concentration/bundle.js -v --debug & \

watchify carbon-budget-line-chart.js -o public/carbon-budget-line-chart/bundle.js -v --debug & \
watchify concentration-line-chart.js -o public/concentration-line-chart/bundle.js -v --debug & \
watchify temperature-line-chart.js -o public/temperature-line-chart/bundle.js -v --debug & \
watchify from-emissions-to-global-warming-line-chart.js -o public/from-emissions-to-global-warming-line-chart/bundle.js -v --debug & \
watchify carbon-budget-temperature-line-chart.js -o public/carbon-budget-temperature-line-chart/bundle.js -v --debug & \
watchify concentration-temperature-line-chart.js -o public/concentration-temperature-line-chart/bundle.js -v --debug & \
watchify carbon-budget-concentration-line-chart.js -o public/carbon-budget-concentration-line-chart/bundle.js -v --debug & \

watch "node ./build_html.js" ./templates
