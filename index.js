// #!/usr/bin/env node

var argv = require('yargs').argv
var asciize = require('./js/asciizer.js').asciize

asciize(argv._[0], argv._[1], argv._[2], rows => console.log(rows.join('\n')));
