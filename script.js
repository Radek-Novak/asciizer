"use strict"

const fs = require('fs')
const asciize = require('./js/asciizer.js')

const PATH = '../../Pictures/2015-12-21/'
const PIC_PATH = PATH + 'b/'

const dir = fs.readdirSync(PIC_PATH).filter( file => file.includes('jpg'))
dir.forEach( (file, i) => {
  if (i % 5 === 0) {
    asciize({
        src: PIC_PATH + file,
        x: 100,
        y: 50,
        chars: " .,:;tJIH#NM@".split('').reverse().join('')
      },
      rows => {
        console.log(`${i}/${Math.floor(dir.length / 5)}`);
        fs.writeFile(PATH + 'txt7/' + file.match(/\d+/)[0] + '.txt', rows.join('\n'))
      }

    )
  }

})
