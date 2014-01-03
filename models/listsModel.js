'use strict';

var db = require('./commonModel').db;

exports.findByName = function(req, res) {
  var name = req.body.name || req.params.name;
  db.collection('lists', function(err, collection) {
    collection.findOne({'name': name}, {_id: 0}, function(err, item) {
      res.send(item);
    });
  });
};
 
exports.findAll = function(req, res) {
  db.collection('lists', function(err, collection) {
    collection.find('', {_id: 0}).toArray(function(err, items) {
      res.send(items);
    });
  });
};
 
exports.saveList = function(req, res) {
  var name = req.body.name || req.params.name;
  var list = req.body;
  list.name = name;
  if (name){
    db.collection('lists', function(err, collection) {
      delete list._id;
      collection.update({'name': name}, list, {'upsert': true}, function(err, result) {
        if (err) {
          console.log('Error updating: ' + err);
          res.status(500).send('Unable to save list');
        } else {
          res.send({'status': result});
        }
      });
    });
  } else {
    res.status(500).send('No specificed list name');
  }
    
};
 
exports.deleteList = function(req, res) {
  var name = req.body.name || req.params.name;
  if (!name) {
    res.status(500).send('No list name specificed');
  } else {
    db.collection('lists', function(err, collection) {
      collection.remove({'name': name}, function(err, result) {
        if (err) {
          res.status(500).send('Unable to delete list');
        } else {
          res.send({'status': result});
        }
      });
    });
  }
};
