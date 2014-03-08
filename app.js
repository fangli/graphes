'use strict';
/**
 * Module dependencies.
 */

var express = require('express');
var  http = require('http');
var  path = require('path');

// Initial express
var app = express();
var config = require('./config');
app.set('port', config.listen_port);

app.use(express.cookieParser());
app.use(express.session({ secret: config.cookie_secret }));

// Handle ES requests
require('./models/cas').configureCas(express, app, config.cas_url);
require('./models/esproxy').configureESProxy(app, config.es_host, config.es_port, config.es_user, config.es_passwd);

// Handle another requests
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
require('./controllers/profileController')(app);
require('./controllers/listController')(app);
require('./controllers/archiveController')(app);
require('./controllers/dashboardController')(app);
require('./controllers/casLoginController')(app);

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
