"use strict"
var test = require('tape')
var readSums = require('../js/readSums')


test('sum pixel values', function (t) {
  readSums('test/testimg/3x2.png', 3, 2,
    (sum, meta) => {
      t.equal(meta.maxval, 6120)
      t.equal(sum.get(0, 0), 0)
      t.equal(sum.get(1, 0), 2040)
      t.equal(sum.get(2, 0), 0)
      t.equal(sum.get(0, 1), 4080)
      t.equal(sum.get(1, 1), 6120)
      t.equal(sum.get(2, 1), 4080)
    }
  )
  readSums('test/testimg/colordiag-rg.png',2, 2,
    (sum, meta) => {
      t.equal(meta.maxval, 6120)
      t.equal(sum.get(0, 0), 2040)
      t.equal(sum.get(1, 0), 2040)
      t.equal(sum.get(0, 1), 2040)
      t.equal(sum.get(1, 1), 2040)

      t.end()
    }
  )
});
