"use strict"

const ndarray = require('ndarray')

const getRows = (array,  X, Y) => {
  const arr = ndarray(array, [X, Y])
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

module.exports = getRows
