'use strict';
/**
 * Module dependencies.
 */

var express = require('express');
var  http = require('http');
var  path = require('path');

// Initial express
var app = express();
app.set('port', process.env.PORT || 3000);

// Handle ES requests
require('./models/esproxy').configureESProxy(app, 'ES_SERVER', ES_PORT, 'ES_USER', 'ES_PASSWORD');

// Handle another requests
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
require('./controllers/profileController')(app);
require('./controllers/listController')(app);
require('./controllers/archiveController')(app);

// Handler frontend app
app.use(express.static(path.join(__dirname, 'public')));

// Redirect rest requests to index.html
app.use(function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});

// Create server
http.createServer(app).listen(app.get('port'), function(){
  console.log('GraphES server listening on port ' + app.get('port'));
});
