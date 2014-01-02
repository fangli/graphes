'use strict';

var mongo = require('mongodb');
 
var Db = mongo.Db;
var server = new mongo.Server('localhost', 27017);
var db = new Db('graphes', server, {auto_reconnect: true, w: 1, journal: false, fsync: false});
 
db.open(function(err) {
  if(err) {
    console.log('Unable to connect to MongoDB');
  } else {
    console.log('Connected to MongoDB');
  }
});

exports.db = db;
