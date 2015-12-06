"use strict"
var test = require('tape')
var readSums = require('../js/asciizer.js').readSums
var assignCharacters = require('../js/asciizer.js').assignCharacters
var asciize = require('../js/asciizer.js').asciize
const equalizeHistogram = require('../js/equalizeHistogram.js').equalizeHistogram


test('sum pixel values', function (t) {
  readSums('test/testimg/3x2.png', 3, 2,
    (sum, maxval) => {
      t.equal(maxval, 6120)
      t.equal(sum.get(0, 0), 0)
      t.equal(sum.get(1, 0), 2040)
      t.equal(sum.get(2, 0), 0)
      t.equal(sum.get(0, 1), 4080)
      t.equal(sum.get(1, 1), 6120)
      t.equal(sum.get(2, 1), 4080)
    }
  )
  readSums('test/testimg/colordiag-rg.png',2, 2,
    (sum, maxval) => {
      t.equal(maxval, 6120)
      t.equal(sum.get(0, 0), 2040)
      t.equal(sum.get(1, 0), 2040)
      t.equal(sum.get(0, 1), 2040)
      t.equal(sum.get(1, 1), 2040)

      t.end()
    }
  )
});

test('assign characters', t => {
  const allblack = equalizeHistogram([20,0,5,10,0,33], 33, 9)
  const allwhite = equalizeHistogram([4,4,4,4], 4, 9)
  const chars = " .-:*+=%#@".split("")
  // t.equal(assignCharacters(allblack, chars).join(''), '      ')
  t.equal(assignCharacters(allwhite, chars).join(''), '@@@@')

  t.end()
})

// test('integration', t => {
//   asciize('test/testimg/white.jpg', 2, 2, rows => {
//     t.deepEqual(rows, ['@@', '@@'])
//
//     t.end()
//   })
//
// })
