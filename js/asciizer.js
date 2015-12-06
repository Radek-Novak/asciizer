"use strict";

const getPixels = require('get-pixels')
const ndarray = require('ndarray')
const equalizeHistogram = require('./equalizeHistogram.js').equalizeHistogram

const readSums = function (img, sizeX, sizeY, cb) {
  getPixels(img, function  (err, pixels) {
    let sum = ndarray(new Uint16Array(sizeX*sizeY), [sizeX, sizeY])
    const picX = pixels.shape[0]
    const picY = pixels.shape[1]
    const stepX = Math.floor(picX / sizeX)
    const stepY = Math.floor(picY / sizeY)
    const maxval = stepX*stepY*255*3

    for (let y = 0; y < picY / stepY; y++) {
      for (let x = 0; x < picX / stepX; x++) {
        let count = 0
        for (let py = 0; py < stepY; py++) {
          for (let px = 0; px < stepX; px++) {
            const R = pixels.get(x * stepX + px, y * stepY + py, 0)
            const G = pixels.get(x * stepX + px, y * stepY + py, 1)
            const B = pixels.get(x * stepX + px, y * stepY + py, 2)
            // const A = pixels.get(x * stepX + px, y * stepY + py, 3)
            count += R + G + B
          }
        }
        sum.set(x, y, count)
      }
    }
    cb(sum, maxval)
  })
}

const assignCharacters = (counts, chars) => counts.map( val => chars[Math.floor(val)] )

const getRows = (array, maxval, X, Y) => {
  const equalizedData = equalizeHistogram([...array.data], maxval, 9)
  const asciized = assignCharacters(equalizedData, " .-:*+=%#@".split("").reverse())
  const arr = ndarray(asciized, [X, Y])
  let res = []

  for (let y = 0; y < Y; y++) {
    let row = []
    for (let x = 0; x < X; x++) {
      row.push(arr.get(x, y))
    }
    res.push(row.join(''))
  }
  return res
}

// readSums(
//   'testimg/diag.jpg',
//   80,
//   30,
//   (sum, maxval) => {
//     console.log(getRows(sum, maxval, 80, 30).join('\n'))
//   }
// )

const asciize = (src, x, y, cb) => {
  readSums(
    src,
    x,
    y,
    (sum, maxval) => {
      cb(getRows(sum, maxval, x, y))
    }
  )
}

// asciize('testimg/diag.jpg',
//   80,
//   30,
//   rows => console.log(rows));

exports.readSums = readSums;
exports.assignCharacters = assignCharacters;
exports.asciize = asciize;
