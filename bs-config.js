"use strict"

// Browser-sync config file
// See http://www.browsersync.io/docs/options/

module.exports = {
  open: false,
  files: [
    "public/**"
  ],
  server: {
    baseDir: "./public"
  }
}

