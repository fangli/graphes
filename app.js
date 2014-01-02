'use strict';
/**
 * Module dependencies.
 */

var express = require('express');
var  http = require('http');
var  path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

require('./controllers/profileController')(app);
require('./controllers/listController')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('GraphES server listening on port ' + app.get('port'));
});
