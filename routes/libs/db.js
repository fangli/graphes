'use strict';

var cli = require('redis').createClient();
// cli.emit('error');
cli.on('error', function(msg){console.log('Redis:' + msg);});
exports.cli = cli;
