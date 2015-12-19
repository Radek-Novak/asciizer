"use strict"

const getPixels = require('get-pixels')
const ndarray = require('ndarray')

const readSums = function (img, sizeX, sizeY, cb) {
  getPixels(img, function  (err, pixels) {
    const picX = pixels.shape[0]
    const picY = pixels.shape[1]
    const ratio = picX / picY

    sizeX = !sizeX && sizeY ? Math.floor(sizeY * ratio) : sizeX
    sizeY = !sizeY && sizeX ? Math.floor(sizeX / ratio) : sizeY


    let sum = ndarray(new Uint16Array(sizeX*sizeY), [sizeX, sizeY])
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
    cb(sum, {maxval, sizeX, sizeY})
  })
}

module.exports = readSums
