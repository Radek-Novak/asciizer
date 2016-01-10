const equalizeHistogram = function(src, inMax, outMax) {
  const step = (inMax + 1)  / (outMax + 1)

  return src.map( n => Math.floor(n / step))
}

module.exports = equalizeHistogram
