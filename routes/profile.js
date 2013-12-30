'use strict';
/*
 * GET es page.
 */

var db = require('./libs/db').cli;

exports.postProfile = function(req, res){
  db.hset('profiles', req.body.name, JSON.stringify(req.body), function(error){
    if(error) {
      res.status(500);
    } else {
      res.send('OK');
    }
  });
};

exports.delProfile = function(req, res){
  db.hdel('profiles', req.body.name, function(error){
    if(error) {
      res.status(500);
    } else {
      res.send('OK');
    }
  });
};

exports.getProfile = function(req, res){
  db.hgetall('profiles', function(error, keys){
    if(error) {
      res.status(500);
    } else {
      for (var k in keys) {
        keys[k] = JSON.parse(keys[k]);
      }
      if (keys === null) {keys = {};}
      res.send(JSON.stringify(keys));
    }
  });
};
