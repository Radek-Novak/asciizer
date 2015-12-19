"use strict"
const test = require('tape')
const assignCharacters = require('../js/assignCharacters.js')
const equalizeHistogram = require('../js/equalizeHistogram')

test('assign characters', t => {
  const chars = " .-:*+=%#@"
  const charArr = chars.split("")
  const testArray = [0,1,2,3,4,5,6,7,8,9]
  const testArray2 = [4,9,8,3]

  t.equal(assignCharacters(testArray, charArr).join(''), chars)
  t.equal(assignCharacters(testArray2, charArr).join(''), '*@#:')
  t.end()
})
