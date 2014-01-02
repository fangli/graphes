'use strict';

var db = require('./commonModel').db;

exports.findByName = function(req, res) {
  var name = req.body.name || req.params.name;
  db.collection('lists', function(err, collection) {
    collection.findOne({'name':name}, function(err, item) {
      res.send(item);
    });
  });
};
 
exports.findAll = function(req, res) {
  db.collection('lists', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
};
 
exports.saveList = function(req, res) {
  var name = req.body.name || req.params.name;
  var list = req.body;
  list.name = name;
  db.collection('lists', function(err, collection) {
    collection.update({'name':name}, list, {upsert:true}, function(err, result) {
      if (err) {
        console.log('Error updating: ' + err);
        res.send({'error':'An error has occurred'});
      } else {
        res.send(result);
      }
    });
  });
};
 
exports.deleteList = function(req, res) {
  var name = req.body.name || req.params.name;
  db.collection('lists', function(err, collection) {
    collection.remove({'name':name}, function(err, result) {
      if (err) {
        res.send({'error':'Error deleting:' + err});
      } else {
        res.send(result);
      }
    });
  });
};
