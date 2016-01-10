// #!/usr/bin/env node

"use strict"

const argv = require('yargs').argv
const asciize = require('./js/asciizer.js')

const argSrc = argv._[0]

if (argSrc && ( argv.w || argv.h)) {
  asciize({
      src: argSrc,
      x: argv.w,
      y: argv.h,
      chars: argv.chars
    },
    rows => console.log(rows.join('\n'))
  )
} else {
  console.error(`
    Usage:
    e.g.:
    node index.js test/testimg/diag.jpg -w 100 --chars abcdefghij
    node index.js test/testimg/diag.jpg -w 120 --chars " .,:;tJIH#NM@"
    node index.js test/testimg/diag.jpg -h 50
    `);
}
