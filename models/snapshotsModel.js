'use strict';

var db = require('./commonModel').db;
var ObjectID = require('./commonModel').ObjectID;

exports.findByName = function(req, res) {
  var name = req.params.name;
  if (!name) {
    res.send([]);
  }
  db.collection('snapshots', function(err, collection) {
    try {
      collection.findOne({'_id': new ObjectID.createFromHexString(name)}, function(err, item) {
        res.send(JSON.parse(item['body']));
      });
    } catch(e) {
      res.send([]);
    }
  });
};
 

exports.saveSnapshot = function(req, res) {
  var snapshot = req.body;
  db.collection('snapshots', function(err, collection) {
    collection.insert({body: JSON.stringify(snapshot)}, function(err, result) {
      if (err) {
        console.log('Error updating: ' + err);
        res.status(500).send('Unable to save chart snapshots');
      } else {
        res.send({'_id': result[0]['_id']});
      }
    });
  });
    
};
 
exports.deleteSnapshot = function(req, res) {
  var name = req.params.name;
  if (!name) {
    res.status(500).send('No snapshot ID specificed');
  } else {

    var id;
    try {
      id = new ObjectID.createFromHexString(name);
    } catch(e) {
      res.send({'status': 0});
    }

    db.collection('snapshots', function(err, collection) {
      collection.remove({'_id': id}, function(err, result) {
        if (err) {
          res.status(500).send('Unable to delete snapshot');
        } else {
          res.send({'status': result});
        }
      });
    });
  }
};
