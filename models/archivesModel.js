'use strict';

var db = require('./commonModel').db;
var ObjectID = require('./commonModel').ObjectID;

exports.findByName = function(req, res) {
  var name = req.params.name;
  if (!name) {
    res.send([]);
  }
  db.collection('archives', function(err, collection) {
    try {
      collection.findOne({'_id': new ObjectID.createFromHexString(name)}, function(err, item) {
        res.send(JSON.parse(item['body']));
      });
    } catch(e) {
      res.send([]);
    }
  });
};
 

exports.saveArchive = function(req, res) {
  var archive = req.body;
  db.collection('archives', function(err, collection) {
    collection.insert({body: JSON.stringify(archive)}, function(err, result) {
      if (err) {
        console.log('Error updating: ' + err);
        res.status(500).send('Unable to save chart archives');
      } else {
        res.send({'_id': result[0]['_id']});
      }
    });
  });
    
};
 
exports.deleteArchive = function(req, res) {
  var name = req.params.name;
  if (!name) {
    res.status(500).send('No archive ID specificed');
  } else {

    var id;
    try {
      id = new ObjectID.createFromHexString(name);
    } catch(e) {
      res.send({'status': 0});
    }

    db.collection('archives', function(err, collection) {
      collection.remove({'_id': id}, function(err, result) {
        if (err) {
          res.status(500).send('Unable to delete archive');
        } else {
          res.send({'status': result});
        }
      });
    });
  }
};
