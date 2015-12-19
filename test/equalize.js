"use strict"
var test = require('tape')
var equalize = require('../js/equalize')

test('equalize values', function (t) {
  const t1 = equalize([3, 55, 88], 89, 9)
  const t1correct = [0, 6, 9]

  t.deepEqual(t1, t1correct)

  t.end()
});
