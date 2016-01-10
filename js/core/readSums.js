"use strict"

const ndarray = require('ndarray')

const readSums = function (getPixels, options, cb) {
  const processPixels = function  (err, pixels) {
    // console.log(pixels);
    const picX = pixels.shape[0]
    const picY = pixels.shape[1]
    const ratio = picX / picY

    options.sizeX = !options.sizeX && options.sizeY ? Math.floor(options.sizeY * 2 * ratio) : options.sizeX
    options.sizeY = !options.sizeY && options.sizeX ? Math.floor(options.sizeX / (2 * ratio)) : options.sizeY

    let sum = ndarray(new Uint32Array(options.sizeX * options.sizeY), [options.sizeX, options.sizeY])
    const stepX = Math.floor(picX / options.sizeX)
    const stepY = Math.floor(picY / options.sizeY)
    const maxval = stepX * stepY * 255 * 3

    for (let y = 0; y < Math.floor(picY / stepY); y++) {
      for (let x = 0; x < Math.floor(picX / stepX); x++) {
        let count = 0
        for (let py = 0; py < Math.floor(stepY); py++) {
          for (let px = 0; px < Math.floor(stepX); px++) {
            const R = pixels.get(x * stepX + px, y * stepY + py, 0)
            const G = pixels.get(x * stepX + px, y * stepY + py, 1)
            const B = pixels.get(x * stepX + px, y * stepY + py, 2)
            // const A = pixels.get(x * stepX + px, y * stepY + py, 3)
            count += R + G + B
            // count += R * 0.299 + G * 0.587 + B * 0.114
          }
        }
        sum.set(x, y, count)
      }
    }
    cb(sum, {maxval, sizeX: options.sizeX, sizeY: options.sizeY})
  }


  if (options.numValues){
    setTimeout(() => processPixels(null, options.numValues), 0)
  } else {
    getPixels(options.src, processPixels)
  }

}

module.exports = readSums
