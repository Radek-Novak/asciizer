"use strict";

const equalizeHistogram = require('./equalizeHistogram')
const assignCharacters = require('./assignCharacters')
const readSums = require('./readSums')
const getRows = require('./getRows')
const getPixels = require('dom-pixels')

// options {src, x, y, chars}
const asciize = (options, cb) => {
  if (!options.src)
    throw "Missing src"
  options.chars = options.chars || " .-:*+=%#@"
  readSums(
    getPixels,
    {
      src: options.src,
      sizeX: options.x,
      sizeY: options.y,
      numValues: options.numValues // ndarray instead of file or dataurl
    },
    (sum, meta) => {
      const equalizedData = equalizeHistogram([...sum.data], meta.maxval, options.chars.length - 1)
      const asciized = assignCharacters(equalizedData, options.chars)
      const formatted = getRows(asciized,  meta.sizeX, meta.sizeY)

      cb(formatted)
    }
  )
}

module.exports = asciize;
