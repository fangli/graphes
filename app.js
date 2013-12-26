'use strict';
/**
 * Module dependencies.
 */

var express = require('express'),
  es = require('./routes/es'),
  profile = require('./routes/profile'),
  http = require('http'),
  path = require('path');
 
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


// app.get('/', routes.index);
app.get('/api/db/profiles', profile.getProfile);
app.post('/api/db/profiles', profile.postProfile);
app.del('/api/db/profiles', profile.delProfile);

app.get('/api/es/getindices', es.getindices);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
