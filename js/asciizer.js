"use strict";

const ndarray = require('ndarray')
const equalizeHistogram = require('./equalize')
const assignCharacters = require('./assignCharacters')
const readSums = require('./readSums')


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
    (sum, meta) => {
      cb(getRows(sum, meta.maxval, meta.sizeX, meta.sizeY))
    }
  )
}

module.exports = asciize;
