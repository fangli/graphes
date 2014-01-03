'use strict';

var db = require('./commonModel').db;

exports.findByName = function(req, res) {
  var name = req.body.name || req.params.name;
  db.collection('profiles', function(err, collection) {
    collection.findOne({'name': name}, {_id: 0}, function(err, item) {
      res.send(item);
    });
  });
};
 
exports.findAll = function(req, res) {
  db.collection('profiles', function(err, collection) {
    collection.find('', {_id: 0}).toArray(function(err, items) {
      res.send(items);
    });
  });
};
 
exports.saveProfile = function(req, res) {
  var name = req.body.name || req.params.name;
  var profile = req.body;
  profile.name = name;
  if (name){
    db.collection('profiles', function(err, collection) {
      delete profile._id;
      collection.update({'name': name}, profile, {'upsert': true}, function(err, result) {
        if (err) {
          console.log('Error updating: ' + err);
          res.status(500).send('Unable to save profile');
        } else {
          res.send({'status': result});
        }
      });
    });
  } else {
    res.status(500).send('No specificed profile name');
  }
    
};
 
exports.deleteProfile = function(req, res) {
  var name = req.body.name || req.params.name;
  if (!name) {
    res.status(500).send('No profile name specificed');
  } else {
    db.collection('profiles', function(err, collection) {
      collection.remove({'name': name}, function(err, result) {
        if (err) {
          res.status(500).send('Unable to delete profile');
        } else {
          res.send({'status': result});
        }
      });
    });
  }
};
