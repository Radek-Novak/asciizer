"use strict"
const test = require('tape')
const readSums = require('../js/core/readSums')
const ndarray = require('ndarray')
const getPixels = require('get-pixels')

test('pretest testing data', t => {
  getPixels('test/testimg/3x2.png', (err, pixels) => {
    const nd = ndarray(
      { 0: 0, 1: 0, 10: 0, 100: 0, 101: 255, 102: 255, 103: 255, 104: 255, 105: 255, 106: 255, 107: 255, 108: 255, 109: 255, 11: 255, 110: 255, 111: 255, 112: 255, 113: 255, 114: 0, 115: 255, 116: 255, 117: 255, 118: 0, 119: 255, 12: 0, 120: 0, 121: 255, 122: 255, 123: 255, 124: 0, 125: 255, 126: 255, 127: 255, 128: 255, 129: 255, 13: 255, 130: 255, 131: 255, 132: 255, 133: 255, 134: 255, 135: 255, 136: 255, 137: 255, 138: 0, 139: 255, 14: 0, 140: 255, 141: 255, 142: 0, 143: 255, 144: 0, 145: 255, 146: 255, 147: 255, 148: 0, 149: 255, 15: 255, 150: 255, 151: 255, 152: 255, 153: 255, 154: 255, 155: 255, 156: 255, 157: 255, 158: 255, 159: 255, 16: 0, 160: 255, 161: 255, 162: 0, 163: 255, 164: 255, 165: 255, 166: 0, 167: 255, 168: 0, 169: 255, 17: 0, 170: 255, 171: 255, 172: 0, 173: 255, 174: 255, 175: 255, 176: 255, 177: 255, 178: 255, 179: 255, 18: 0, 180: 255, 181: 255, 182: 255, 183: 255, 184: 255, 185: 255, 186: 0, 187: 255, 188: 255, 189: 255, 19: 255, 190: 0, 191: 255, 2: 0, 20: 0, 21: 0, 22: 0, 23: 255, 24: 0, 25: 0, 26: 0, 27: 255, 28: 0, 29: 0, 3: 255, 30: 0, 31: 255, 32: 0, 33: 255, 34: 0, 35: 255, 36: 0, 37: 255, 38: 0, 39: 255, 4: 0, 40: 0, 41: 0, 42: 0, 43: 255, 44: 0, 45: 0, 46: 0, 47: 255, 48: 0, 49: 0, 5: 0, 50: 0, 51: 255, 52: 0, 53: 0, 54: 0, 55: 255, 56: 0, 57: 255, 58: 0, 59: 255, 6: 0, 60: 0, 61: 255, 62: 0, 63: 255, 64: 0, 65: 0, 66: 0, 67: 255, 68: 0, 69: 0, 7: 255, 70: 0, 71: 255, 72: 0, 73: 0, 74: 0, 75: 255, 76: 0, 77: 0, 78: 0, 79: 255, 8: 0, 80: 0, 81: 255, 82: 0, 83: 255, 84: 0, 85: 255, 86: 0, 87: 255, 88: 0, 89: 0, 9: 255, 90: 0, 91: 255, 92: 0, 93: 0, 94: 0, 95: 255, 96: 0, 97: 255, 98: 255, 99: 255 },
      [6, 8, 4],
      [4, 24, 1]
    )

    t.deepEquals(pixels, nd)
    t.end()
  })
})

test('sum pixel values', function (t) {
  readSums(
    getPixels,
    {
      src: 'test/testimg/3x2.png',
      sizeX: 3,
      sizeY: 2
    },
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
  readSums(
    getPixels,
    {
      numValues: ndarray(
        [0, 0, 0, 255, 0, 0, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 255, 0, 255, 0, 255, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 255, 255, 255, 0, 255, 0, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 255, 255, 255, 0, 255, 0, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 255, 255, 255, 0, 255, 0, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0, 255, 255, 255, 0, 255],
        [6, 8, 4],
        [4, 24, 1]
      ),
      sizeX: 3,
      sizeY: 2

    },
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
  readSums(
    getPixels,
    {
      src: 'test/testimg/colordiag-rg.png',
      sizeX: 2,
      sizeY: 2
    },
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
