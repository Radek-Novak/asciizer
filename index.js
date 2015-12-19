// #!/usr/bin/env node

var argv = require('yargs').argv
var asciize = require('./js/asciizer.js')

asciize(argv._[0], argv.w, argv.h, rows => console.log(rows.join('\n')));
